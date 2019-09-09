import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  deleteProjects,
  fetchProjects,
  projectsDeleteFailure,
  projectsDeleteRequest,
  projectsDeleteSuccess
} from '../../state/projects/projectsActions';
import ProjectService from '../../services/Project';

import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Grid from '../../components/Grid';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import Sidebar from './Sidebar';

class ProjectEditPage extends React.Component {
  state = {
    project_id: null,
    isDeleted: false,
    isUpdated: false,
    project: {},
    errors: [],
  };

  componentDidMount() {
    const {
      dispatch,
      projects,
      match: {
        params: {
          project_id,
        },
      },
    } = this.props;

    if (typeof projects.items === 'object' && projects.items.length === 0) {
      dispatch(fetchProjects());
    }

    this.setState({
      project_id: project_id,
      project: projects.items[project_id] || {},
    });
  }

  /**
   * Handle project input change.
   *
   * @param {object} event
   * @return {void}
   */
  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState(state => ({
      project: {
        ...state.project,
        [name]: value
      }
    }));
  };

  /**
   * Handle project update.
   */
  handleProjectUpdateClick = () => {
    const {project} = this.state;
    const projectService = new ProjectService;

    projectService
      .update(project.id, project)
      .then(response => {
        this.setState({
          isUpdated: true,
          errors: []
        });
      },
      error => {
        let errorResponse = error.response.data;
        errorResponse = errorResponse.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;

        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
            return previous.concat(errorResponse[key][0]);
          }, []);

        this.setState({errors: errors});
      });
  };

  /**
   * Handle project delete.
   */
  handleProjectDeleteClick = () => {
    const { dispatch } = this.props;
    const { project } = this.state;
    const projectService = new ProjectService();

    dispatch(projectsDeleteRequest());

    projectService
      .delete(project.id)
      .then(response => {
          $('#project-delete-modal').modal('hide');

          this.setState({isDeleted: true});

          dispatch(projectsDeleteSuccess(project.id));
        },
        error => {
          dispatch(projectsDeleteFailure());
        });
  };

  /**
   * Handle show project delete modal.
   */
  modalProjectDeleteClick = () => {
    $('#project-delete-modal').modal('show');
  };

  render = () => {
    const {
      isDeleted,
      isUpdated,
      project,
      errors,
    } = this.state;
    
    if (isDeleted) {
      return <Redirect to={'/'} />
    }

    if (isUpdated) {
      return <Redirect to={'/projects/' + project.id} />
    }

    return (
      <Layout project={project}>
        <div className="content">
          <Container fluid>
            <div className="heading">
              <h2>General Settings</h2>
            </div>
          </Container>

          <Container fluid>
            <div className="row">
              <Grid xs={12} sm={3}>
                <Sidebar project={project} />
              </Grid>

              <Grid xs={12} sm={9}>
                <Panel>
                  <PanelHeading>
                    <PanelTitle>General Settings</PanelTitle>
                  </PanelHeading>
                  <PanelBody>
                    {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

                    <div className="form-group">
                      <label htmlFor="name">Project name</label>
                      <input
                        className="form-control"
                        name="name"
                        type="text"
                        onChange={this.handleInputChange}
                        value={project.name}
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
                            checked={project.deploy_on_push}
                          /> Deploy when code is pushed to
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button
                        color="primary"
                        onClick={this.handleProjectUpdateClick}
                      >Save</Button>
                    </div>
                  </PanelBody>
                </Panel>

                <Panel>
                  <PanelHeading>
                    <PanelTitle>Danger Zone</PanelTitle>
                  </PanelHeading>
                  <PanelBody>
                    <label>Delete This Project</label>
                    <p>Once you delete this project, there is no going back.</p>
                    <Button
                      color="danger"
                      onClick={this.modalProjectDeleteClick}
                    >Delete Project</Button>
                  </PanelBody>
                </Panel>
              </Grid>
            </div>
          </Container>

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
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projects
  };
};

export default connect(
  mapStateToProps
)(ProjectEditPage);