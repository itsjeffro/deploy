import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AceEditor from 'react-ace';

import { alertShow } from '../../actions/alert';

import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import ProjectActionService from '../../services/ProjectAction';
import ProjectActionHookService from '../../services/ProjectActionHook';

import HooksTable from './HooksTable';

import AlertErrorValidation from '../../components/AlertErrorValidation'; 
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';

class ProjectActionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      action: {},
      beforeHooks: [],
      afterHooks: [],
      hook: {
        name: '',
        script: '',
        order: 0
      },
      errors: []
    };

    this.handleEditModalClick = this.handleEditModalClick.bind(this);
    this.handleRemoveModalClick = this.handleRemoveModalClick.bind(this);
    this.handleAddHookClick = this.handleAddHookClick.bind(this);
    this.handleEditHookClick = this.handleEditHookClick.bind(this);
    this.handleRemoveHookClick = this.handleRemoveHookClick.bind(this);
    this.handleInputNameChange = this.handleInputNameChange.bind(this);
    this.handleScriptChange = this.handleScriptChange.bind(this);
  }

  componentWillMount() {
    const { project } = this.props;
    const { project_id, action_id } = this.props.match.params;
    const projectActionService = new ProjectActionService;
    
    this.setState({project: project});

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
   * Render hooks table.
   * 
   * @param {object} hooks
   * @return {XML}
   */
  renderHooksTable(hooks) {
    if (!this.state.isFetching && hooks !== undefined && hooks.length > 0) {
      return (
        <div className="table-responsive hooks-table">
          <HooksTable
          	hooks={hooks}
          	onHandleEditClick={this.handleEditModalClick}
          	onHandleRemoveClick={this.handleRemoveModalClick}
          />
        </div>
      )
    }

    return (
      <PanelBody>
        No hooks have been configured.
      </PanelBody>
    )
  }
  
  /**
   * Show modal to create hook.
   * 
   * @param {int} position
   */
  handleAddModalClick(position) {
    const { action, project } = this.state;

    this.setState({
      errors: [],
      hook: {
        name: '',
        script: '',
        project_id: project.id,
        action_id: action.id,
        position: position,
        order: 0,
      }
    });

    $('#add-hook-modal').modal('show');
  }

  /**
   * Show modal to edit hook.
   * 
   * @param {object} hook
   */
  handleEditModalClick(hook) {
    this.setState({
      hook: hook,
      errors: []
    });

    $('#edit-hook-modal').modal('show');
  }

  /**
   * Show modal to confirm hook remove.
   * 
   * @param {object} hook
   */
  handleRemoveModalClick(hook) {
    this.setState({hook: hook});

    $('#remove-hook-modal').modal('show');
  }

  /**
   * Handle click to process hook create.
   */
  handleAddHookClick() {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;
   
    let data = Object.assign({}, hook);
    
    projectActionHookService
      .create(hook.project_id, hook.action_id, data)
      .then(response => {
        dispatch(alertShow('Hook created successfully.'));

        if (hook.position == 1) {
        	let hooks = this.state.beforeHooks.concat(response.data);

        	this.setState({
        		beforeHooks: hooks,
        		errors: []
        	});
        } else if (hook.position == 2) {
        	let hooks = this.state.afterHooks.concat(response.data);

        	this.setState({
        		afterHooks: hooks,
        		errors: []
        	});
        }
        
        $('#add-hook-modal').modal('hide');
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;
        
        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);
        
        this.setState({errors: errors});
      });
  }

  /**
   * Handle click to process hook update.
   */
  handleEditHookClick() {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;
    
    let data = Object.assign({}, hook);

    projectActionHookService
      .update(hook.project_id, hook.action_id, hook.id, data)
      .then(response => {
        let hookPosition = hook.position == 1 ? 'beforeHooks' : 'afterHooks';

        dispatch(alertShow('Hook updated successfully.'));

        this.setState({
        	errors: [],
        	[hookPosition]: this.updateHook(hookPosition, hook.id, response.data)
        });
        
        $('#edit-hook-modal').modal('hide');
      },
      error => {
        let errorResponse = error.response.data;

        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;
        
        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);
        
        this.setState({errors: errors});
      });
  }
  
  /**
   * Update hooks (before or after) state to update hook specified by it's id.
   * 
   * @param {string} hook_position
   * @param {int} hook_id
   * @param {object} updated_hook
   */
  updateHook(hook_position, hook_id, updated_hook) {
    const hooks = this.state[hook_position];
    
    return hooks.map(hook => {
	  if (hook.id === updated_hook.id) {
	    return Object.assign(hook, updated_hook);
	  }

	  return Object.assign({}, hook);
	});
  }

  /**
   * Handle click to process hook remove.
   */
  handleRemoveHookClick() {
    const { dispatch } = this.props;
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;

    projectActionHookService
      .delete(hook.project_id, hook.action_id, hook.id)
      .then(response => {
        let hookPosition = hook.position == 1 ? 'beforeHooks' : 'afterHooks';

        dispatch(alertShow('Hook removed successfully.'));

        this.removeHook(hookPosition, hook.id);
      },
      error => {
        alert('Could not delete hook');
      });

    $('#remove-hook-modal').modal('hide');
  }
  
  /**
   * Update hooks (before or after) state to filter out hook specified by it's id.
   * 
   * @param {string} hook_position
   * @param {int} hook_id
   */
  removeHook(hook_position, hook_id) {
    this.setState(state => {
      const hooks = state[hook_position].filter(hook => {
        return hook.id !== hook_id;
      });
	  
      return {[hook_position]: hooks}
	   });
  }

  /**
   * Handle input name change for hook.
   * 
   * @param {object} event
   */
  handleInputNameChange(event) {
    const value = event.target.value;

    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        name: value
      });
 
      return {hook: hook};
    });
  }
  
  /**
   * Handle script change for hook.
   * 
   * @param {string} value
   */
  handleScriptChange(value) {
    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        script: value
      });
 
      return {hook: hook};
    });
  }

  render() {
    const {
      action,
      project,
      beforeHooks,
      afterHooks,
      hook,
      errors
    } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={'/projects/' + project.id}>{project.name}</Link>{' '}
                <Icon iconName="angle-double-right" />{' '}
                <span className="hidden-xs"> Deployment Hooks <Icon iconName="angle-double-right" /></span>{' '}
                {action.name}
              </span>
            </div>
          </div>
        </div>

        <div className="container content">
          <div className="row">

            <div className="col-xs-12 col-sm-6">
              <div className="form-group pull-right">
                <Button
                  onClick={() => this.handleAddModalClick(1)}
                ><Icon iconName="plus" /> Add Before Hook</Button>
              </div>

              <div className="clearfix"></div>

              <Panel>
                <PanelHeading>
                  <i className="fa fa-code" aria-hidden="true"></i> Before This Action
                </PanelHeading>

                {this.renderHooksTable(beforeHooks)}
              </Panel>
            </div>

            <div className="col-xs-12 col-sm-6">
              <div className="form-group pull-right">
                <Button
                  onClick={() => this.handleAddModalClick(2)}
                ><Icon iconName="plus" /> Add After Hook</Button>
              </div>

              <div className="clearfix"></div>

              <Panel>
                <PanelHeading>
                  <i className="fa fa-code" aria-hidden="true"></i> After This Action
                </PanelHeading>

                {this.renderHooksTable(afterHooks)}
              </Panel>
            </div>
          </div>
        </div>

        <Modal
          id="add-hook-modal"
          title="Add Deployment Hook"
          buttons={[
            {text: 'Cancel', onPress: () => $('#add-hook-modal').modal('hide')},
            {text: 'Save', onPress: () => this.handleAddHookClick()}
          ]}
        >
          {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              className="form-control"
              name="name"
              type="text"
              id="name"
              onChange={this.handleInputNameChange}
              value={hook.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="script">Script</label>
            <AceEditor
              mode="powershell"
              theme="github"
              name="editor-add"
              onChange={this.handleScriptChange}
              style={{height: 200, width: '100%'}}
              value={hook.script}
            />
            <textarea name="script" style={{display: 'none'}}>{hook.script}</textarea>
          </div>
        </Modal>

        <Modal
          id="edit-hook-modal"
          title="Edit Deployment Hook"
          buttons={[
            {text: 'Cancel', onPress: () => $('#edit-hook-modal').modal('hide')},
            {text: 'Save', onPress: () => this.handleEditHookClick()}
          ]}
        >
          {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              className="form-control"
              name="name"
              type="text"
              onChange={this.handleInputNameChange}
              value={hook.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="script">Script</label>
            <AceEditor
              mode="powershell"
              theme="github"
              name="editor-edit"
              value={hook.script}
              onChange={this.handleScriptChange}
              style={{height: 200, width: '100%'}}
            />
            <textarea name="script" style={{display: 'none'}}>{hook.script}</textarea>
          </div>
        </Modal>

        <Modal
          id="remove-hook-modal"
          title="Remove Deployment Hook"
          buttons={[
            {text: 'Cancel', onPress: () => $('#remove-hook-modal').modal('hide')},
            {text: 'Remove', onPress: () => this.handleRemoveHookClick()}
          ]}
        >
          Are you sure you want to remove "{hook.name}"?
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectActionPage);