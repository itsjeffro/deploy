import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AceEditor from 'react-ace';
import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import ProjectActionService from '../../services/ProjectAction';
import ProjectActionHookService from '../../services/ProjectActionHook';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
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
        script: ''
      }
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

  renderHooksTable(hooks) {
    if (!this.state.isFetching && hooks !== undefined && hooks.length > 0) {
      return (
        <div className="table-responsive hooks-table">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {hooks.map(hook =>
                <tr key={hook.id}>
                  <td>
                    {hook.name}
                  </td>
                  <td className="text-right">
                    <Button
                      style={{marginRight: 5}}
                      onClick={() => this.handleEditModalClick(hook)}
                    >Edit</Button>
                    <Button
                      onClick={() => this.handleRemoveModalClick(hook)}
                    >Remove</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="panel-body hooks-placeholder">
        No hooks have been configured.
      </div>
    )
  }

  handleAddModalClick(position) {
    const { action, project } = this.state;

    this.setState({hook: {
      name: '',
      script: '',
      project_id: project.id,
      action_id: action.id,
      position: position,
      order: 0,
    }});

    $('#add-hook-modal').modal('show');
  }

  handleEditModalClick(hook) {
    this.setState({hook: hook});

    $('#edit-hook-modal').modal('show');
  }

  handleRemoveModalClick(hook) {
    this.setState({hook: hook});

    $('#remove-hook-modal').modal('show');
  }

  handleAddHookClick() {
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;
   
    let data = Object.assign({}, hook);
    
    projectActionHookService
      .create(hook.project_id, hook.action_id, data)
      .then(response => {
          alert('Successfully created hook');
        },
        error => {
          alert('Could not create hook');
        });
    
    $('#add-hook-modal').modal('hide');
  }

  handleEditHookClick() {
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;
    
    let data = Object.assign({}, hook);

    projectActionHookService
      .update(hook.project_id, hook.action_id, hook.id, data)
      .then(response => {
        alert('Successfully updated hook');
      },
      error => {
        alert('Could not update hook');
      });

    $('#edit-hook-modal').modal('hide');
  }

  handleRemoveHookClick() {
    const { hook } = this.state;
    const projectActionHookService = new ProjectActionHookService;

    projectActionHookService
      .delete(hook.project_id, hook.action_id, hook.id)
      .then(response => {
          alert('Successfully deleted hook');
        },
        error => {
          alert('Could not delete hook');
        });

    $('#remove-hook-modal').modal('hide');
  }

  handleInputNameChange(event) {
    const value = event.target.value;

    this.setState(state => {
      let hook = Object.assign({}, state.hook, {
        name: value
      });
      return {hook: hook};
    });
  }
  
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
      hook
    } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" />
                <span className="hidden-xs"> Deployment Hooks <Icon iconName="angle-double-right" /></span> {action.name}
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
                <div className="panel-heading">
                  <i className="fa fa-code" aria-hidden="true"></i> Before This Action
                </div>

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
                <div className="panel-heading">
                  <i className="fa fa-code" aria-hidden="true"></i> After This Action
                </div>

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