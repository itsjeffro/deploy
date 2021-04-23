import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
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
import Grid from "../../components/Grid";
import HooksTable from "./components/HooksTable";
import {reorderMap} from "../../utils/draggable";

class ProjectActionPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    action: {
      id: null,
    },
    hooks: {
      before: [],
      after: [],
    },
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
          hooks: {
            before: response.data.before_hooks,
            after: response.data.after_hooks,
          }
        });
      });
  }

  /**
   * Show modal to create hook.
   */
  handleAddModalClick = (position: number) => {
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

  /**
   * Hide modal (add action).
   */
  handleHideAddHookModal = () => {
    this.setState({ isAddHookModalVisible: false });
  }

  /**
   * Show modal to edit hook.
   */
  handleEditModalClick = (hook: any) => {
    this.setState({
      hook: hook,
      errors: [],
      isEditHookModalVisible: true,
    });
  };

  /**
   * Hide modal (edit action).
   */
  handleHideEditHookModal = () => {
    this.setState({ isEditHookModalVisible: false });
  }

  /**
   * Show modal to confirm hook remove.
   */
  handleRemoveModalClick = (hook: any) => {
    this.setState({
      hook: hook,
      isRemoveHookModalVisible: true,
    });
  };

  /**
   * Hide modal (remove action).
   */
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
        	this.setState((prevState) => ({
        		hooks: {
        		  ...prevState.hooks,
              before: prevState.hooks.before.concat(response.data)
            },
            errors: [],
            isAddHookModalVisible: false,
        	}));
        }
        else if (hook.position === 2) {
        	let hooks = this.state.hooks.after.concat(response.data);

          this.setState((prevState) => ({
            hooks: {
              ...prevState.hooks,
              after: prevState.hooks.after.concat(response.data)
            },
            errors: [],
            isAddHookModalVisible: false,
        	}));
        }
      },
      (error) => {
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
      .then((response) => {
        let hookPosition = hook.position == 1 ? 'before' : 'after';

        dispatch(createToast('Hook updated successfully.'));

        this.setState((prevState) => ({
        	errors: [],
          hooks: {
        	  ...prevState.hooks,
            [hookPosition]: this.updateHook(hookPosition, hook.id, response.data),
          },
          isEditHookModalVisible: false,
        }));
      },
      (error) => {
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
   */
  updateHook = (hook_position: string, hook_id: number, updated_hook: any) => {
    const hooks = this.state.hooks[hook_position];

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
      .then((response) => {
        const hookPosition = hook.position === 1 ? 'before' : 'after';

        dispatch(createToast('Hook removed successfully.'));

        this.removeHook(hookPosition, hook.id);
      },
      (error) => {
        alert('Could not delete hook');
      });

    this.handleHideRemoveHookModal();
  };

  /**
   * Update hooks (before or after) state to filter out hook specified by it's id.
   */
  removeHook = (hook_position: string, hook_id: number) => {
    this.setState((prevState) => {
      const hooks = prevState.hooks[hook_position].filter((hook) => {
        return hook.id !== hook_id;
      });

      return {
        hooks: {
          ...prevState.hooks,
          [hook_position]: hooks,
        }
      }
	   });
  };

  /**
   * Handle input name change for hook.
   */
  handleInputNameChange = (event: any) => {
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
   */
  handleScriptChange = (value: string) => {
    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        script: value
      });

      return { hook: hook };
    });
  };

  /**
   * Handle re-order hooks.
   */
  handleReorder = (result) => {
    const results = reorderMap(
      this.state.hooks,
      result.source,
      result.destination
    );

    console.log(results);

    this.setState({ hooks: results });
  }

  render() {
    const { project } = this.props;

    const {
      hooks,
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

          <DragDropContext onDragEnd={ (data) => this.handleReorder(data) }>
            <Container fluid>
              <div className="row">
                <Grid xs={ 12 } sm={ 6 }>
                  <HooksTable
                    droppableId={ "before" }
                    label="Before This Action"
                    hookPosition={ 1 }
                    hooks={ hooks.before }
                    handleAddModalClick={ this.handleAddModalClick }
                    handleEditModalClick={ this.handleEditModalClick }
                    handleRemoveModalClick={ this.handleRemoveModalClick }
                  />
                </Grid>

                <Grid xs={ 12 } sm={ 6 }>
                  <HooksTable
                    droppableId={ "after" }
                    label="After This Action"
                    hookPosition={ 2 }
                    hooks={ hooks.after }
                    handleAddModalClick={ this.handleAddModalClick }
                    handleEditModalClick={ this.handleEditModalClick }
                    handleRemoveModalClick={ this.handleRemoveModalClick }
                  />
                </Grid>
              </div>
            </Container>
          </DragDropContext>
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
