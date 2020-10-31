import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import { fetchProject } from '../../state/project/actions';
import ProjectActionService from '../../services/ProjectAction';
import ProjectActionHookService from '../../services/ProjectActionHook';
import Layout from "../../components/Layout";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import AddHookModal from './components/AddHookModal';
import EditHookModal from './components/EditHookModal';
import RemoveHookModal from './components/RemoveHookModal';
import Container from '../../components/Container';
import Loader from '../../components/Loader';
import Hooks from './components/Hooks';

class ProjectActionPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    action: {
      id: null,
    },
    beforeHooks: [],
    afterHooks: [],
    hook: {
      id: null,
      project_id: null,
      action_id: null,
      name: '',
      script: '',
      order: 0,
      position: null,
    },
    errors: [],
    isAddHookModalVisible: false,
    isEditHookModalVisible: false,
    isRemoveHookModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { project_id, action_id } = this.props.match.params;
    const projectActionService = new ProjectActionService;

    dispatch(fetchProject(project_id));

    projectActionService
      .get(project_id, action_id)
      .then(response => {
        this.setState({
          isFetching: false,
          action: response.data,
          beforeHooks: response.data.before_hooks,
          afterHooks: response.data.after_hooks,
        });
      });
  }

  /**
   * Show modal to create hook.
   *
   * @param {int} position
   */
  handleAddModalClick = (position) => {
    const { project } = this.props;
    const { action } = this.state;

    this.setState({
      errors: [],
      hook: {
        name: '',
        script: '',
        project_id: project.item.id,
        action_id: action.id,
        position: position,
        order: 0,
      },
      isAddHookModalVisible: true,
    });
  };

  handleHideAddHookModal = () => {
    this.setState({ isAddHookModalVisible: false });
  }

  /**
   * Show modal to edit hook.
   *
   * @param {object} hook
   */
  handleEditModalClick = (hook) => {
    this.setState({
      hook: hook,
      errors: [],
      isEditHookModalVisible: true,
    });
  };

  handleHideEditHookModal = () => {
    this.setState({ isEditHookModalVisible: false });
  }

  /**
   * Show modal to confirm hook remove.
   *
   * @param {object} hook
   */
  handleRemoveModalClick = (hook) => {
    this.setState({
      hook: hook,
      isRemoveHookModalVisible: true,
    });
  };

  handleHideRemoveHookModal = () => {
    this.setState({ isRemoveHookModalVisible: false });
  }

  /**
   * Handle click to process hook create.
   */
  handleAddHookClick = () => {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;

    let data = Object.assign({}, hook);

    projectActionHookService
      .create(hook.project_id, hook.action_id, data)
      .then(response => {
        dispatch(createToast('Hook created successfully.'));

        if (hook.position === 1) {
        	let hooks = this.state.beforeHooks.concat(response.data);

        	this.setState({
        		beforeHooks: hooks,
            errors: [],
            isAddHookModalVisible: false,
        	});
        } else if (hook.position === 2) {
        	let hooks = this.state.afterHooks.concat(response.data);

        	this.setState({
        		afterHooks: hooks,
            errors: [],
            isAddHookModalVisible: false,
        	});
        }
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);

        this.setState({ errors: errors });
      });
  };

  /**
   * Handle click to process hook update.
   */
  handleEditHookClick = () => {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;

    let data = Object.assign({}, hook);

    projectActionHookService
      .update(hook.project_id, hook.action_id, hook.id, data)
      .then(response => {
        let hookPosition = hook.position == 1 ? 'beforeHooks' : 'afterHooks';

        dispatch(createToast('Hook updated successfully.'));

        this.setState({
        	errors: [],
          [hookPosition]: this.updateHook(hookPosition, hook.id, response.data),
          isEditHookModalVisible: false,
        });
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);

        this.setState({ errors: errors });
      });
  };

  /**
   * Update hooks (before or after) state to update hook specified by it's id.
   *
   * @param {string} hook_position
   * @param {int} hook_id
   * @param {object} updated_hook
   */
  updateHook = (hook_position, hook_id, updated_hook) => {
    const hooks = this.state[hook_position];

    return hooks.map(hook => {
      if (hook.id === updated_hook.id) {
        return Object.assign(hook, updated_hook);
      }

      return Object.assign({}, hook);
    });
  };

  /**
   * Handle click to process hook remove.
   */
  handleRemoveHookClick = () => {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;

    projectActionHookService
      .delete(hook.project_id, hook.action_id, hook.id)
      .then(response => {
        let hookPosition = hook.position === 1 ? 'beforeHooks' : 'afterHooks';

        dispatch(createToast('Hook removed successfully.'));

        this.removeHook(hookPosition, hook.id);
      },
      error => {
        alert('Could not delete hook');
      });

    this.handleHideRemoveHookModal();
  };

  /**
   * Update hooks (before or after) state to filter out hook specified by it's id.
   *
   * @param {string} hook_position
   * @param {int} hook_id
   */
  removeHook = (hook_position, hook_id) => {
    this.setState(state => {
      const hooks = state[hook_position].filter(hook => {
        return hook.id !== hook_id;
      });

      return {[hook_position]: hooks}
	   });
  };

  /**
   * Handle input name change for hook.
   *
   * @param {object} event
   */
  handleInputNameChange = (event) => {
    const value = event.target.value;

    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        name: value
      });

      return { hook: hook };
    });
  };

  /**
   * Handle script change for hook.
   *
   * @param {string} value
   */
  handleScriptChange = (value) => {
    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        script: value
      });

      return { hook: hook };
    });
  };

  render() {
    const { project } = this.props;
    const {
      isFetching,
      beforeHooks,
      afterHooks,
      errors,
      hook,
      isAddHookModalVisible,
      isEditHookModalVisible,
      isRemoveHookModalVisible,
    } = this.state;

    return (
      <Layout project={project.item}>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <div className="container-fluid heading">
            <Link to={'/projects/' + project.item.id + '/deployment-hooks'}>Back to Deployment Hooks</Link>
          </div>

          <Container fluid>
            {isFetching ?
              <Loader /> :
              <Hooks 
                beforeHooks={ beforeHooks }
                afterHooks={ afterHooks }
                onAddModalClick={ this.handleAddModalClick }
                onEditModalClick={ this.handleEditModalClick }
                onRemoveModalClick={ this.handleRemoveModalClick }
              />}
          </Container>
        </div>

        <AddHookModal
          isVisible={ isAddHookModalVisible }
          errors={ errors }
          hook={ hook }
          onAddHookClick={ this.handleAddHookClick }
          onInputNameChange={ this.handleInputNameChange }
          onScriptChange={ this.handleScriptChange }
          onDismissModalClick={ this.handleHideAddHookModal }
        />

        <EditHookModal
          isVisible={ isEditHookModalVisible }
          errors={ errors }
          hook={ hook }
          onEditHookClick={ this.handleEditHookClick }
          onInputNameChange={ this.handleInputNameChange }
          onScriptChange={ this.handleScriptChange }
          onDismissModalClick={ this.handleHideEditHookModal }
        />

        <RemoveHookModal
          isVisible={ isRemoveHookModalVisible }
          hook={ hook }
          onRemoveHookClick={ this.handleRemoveHookClick }
          onDismissModalClick={ this.handleHideRemoveHookModal }
        />
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(mapStateToProps)(ProjectActionPage);
