import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import ProjectService from '../../services/Project';

import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';

class ProjectEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      editProject: {},
      isDeleted: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleProjectUpdateClick = this.handleProjectUpdateClick.bind(this);
    this.modalProjectDeleteClick = this.modalProjectDeleteClick.bind(this);
    this.handleProjectDeleteClick = this.handleProjectDeleteClick.bind(this);
  }

  componentWillMount() {
    const { project } = this.props;

    this.setState({editProject: project});
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState(state => {
      let project = Object.assign({}, state.editProject, {
          [name]: value
      });

      return {editProject: project}
    });
  }

  handleProjectUpdateClick() {
    const { editProject } = this.state;
    const projectService = new ProjectService;

    projectService
      .update(editProject.id, editProject)
      .then(response => {
        alert('Updated project');
      },
      error => {
        alert('Failed to update project');
      });
  }

  handleProjectDeleteClick() {
    const { project } = this.props;
    const projectService = new ProjectService;

    projectService
      .delete(project.id)
      .then(response => {
        $('#project-delete-modal').modal('hide');

        this.setState({isDeleted: true});
      },
      error => {
        alert('Failed to delete project');
      });
  }

  modalProjectDeleteClick() {
    $('#project-delete-modal').modal('show');
  }

  render() {
    const { project } = this.props;
    const { editProject, isDeleted } = this.state;

    if (isDeleted) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <span className="heading">
              <Link to={'/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> General Settings
            </span>
          </div>
        </div>

        <div className="container content">
          <div className="row">
            <div className="col-xs-12 col-sm-3">
              <Panel>
                <PanelHeading>
                  <h3 className="panel-title">Project settings</h3>
                </PanelHeading>

                <div className="list-group">
                  <Link to={'/projects/' + project.id + '/edit'} className="list-group-item">General settings</Link>
                  <Link to={'/projects/' + project.id + '/source-control/edit'} className="list-group-item">Source control</Link>
                </div>
              </Panel>
            </div>

            <div className="col-xs-12 col-sm-9">
              <Panel>
                <PanelHeading>
                  General Settings
                </PanelHeading>
                <PanelBody>
                  <div className="form-group">
                    <label htmlFor="name">Project name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      onChange={this.handleInputChange}
                      value={editProject.name}
                    />
                  </div>

                  <div className="form-group">
                    <div className="checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="deploy_on_push"
                          value="1"
                          onChange={this.handleInputChange}
                          checked={editProject.deploy_on_push}
                        /> Deploy when code is pushed to
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <Button
                      color="primary"
                      onClick={this.handleProjectUpdateClick}
                    >Save</Button>
                  </div>

                  <label>Delete This Project</label>
                  <p>Once you delete this project, there is no going back.</p>
                  <Button
                    color="danger"
                    onClick={this.modalProjectDeleteClick}
                  >Delete Project</Button>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>

        <Modal
          id="project-delete-modal"
          title={'Delete Project'}
          buttons={[
            {text: 'Cancel', onPress: () => $('#project-delete-modal').modal('hide')},
            {text: 'Delete Project', onPress: () => this.handleProjectDeleteClick()}
          ]}
        >
          Are you sure you want to delete this project?
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
)(ProjectEditPage);