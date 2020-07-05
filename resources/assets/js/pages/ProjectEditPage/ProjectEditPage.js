import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchProjects, deleteProject } from '../../state/projects/actions';
import { createToast } from "../../state/alert/alertActions";
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
import Sidebar from './components/Sidebar';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import DeleteProjectModal from './components/DeleteProjectModal';

class ProjectEditPage extends React.Component {
  state = {
    project_id: null,
    isDeleted: false,
    isUpdated: false,
    project: {
      name: '',
      deploy_on_push: '',
    },
    errors: [],
    isDeleteProjectModalVisible: false,
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

    dispatch(fetchProjects());

    if (projects.items[project_id] !== undefined) {
      this.setState({
        project: projects.items[project_id]
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {
      projects,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    if (projects.items !== nextProps.projects.items) {
      this.setState({
        project: nextProps.projects.items[project_id]
      });
    }
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
    const { dispatch } = this.props;
    const { project } = this.state;
    const projectService = new ProjectService;

    projectService
      .update(project.id, project)
      .then(response => {
        this.setState({
          isUpdated: true,
          errors: []
        });

        dispatch(createToast('Project updated successfully.'));
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
   * Handle project delete.
   */
  handleProjectDeleteClick = () => {
    const { dispatch } = this.props;
    const { project } = this.state;

    dispatch(deleteProject(project.id));
  };

  /**
   * @returns {void}
   */
  handleShowDeleteProjectModalClick = () => {
    this.setState({ isDeleteProjectModalVisible: true });
  };

  /**
   * @returns {void}
   */
  handleHideDeleteProjectModalClick = () => {
    this.setState({ isDeleteProjectModalVisible: false });
  };

  render = () => {
    const {
      isDeleted,
      isUpdated,
      project,
      errors,
      isDeleteProjectModalVisible,
    } = this.state;

    const {
      projects,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;
    
    if (isDeleted) {
      return <Redirect to={'/'} />
    }

    if (isUpdated) {
      return <Redirect to={'/projects/' + project.id} />
    }

    return (
      <Layout project={projects.items[project_id]}>
        <ProjectHeading project={ project } />

        <div className="content">
          <Container fluid>
            <div className="row">
              <Grid xs={12} sm={3}>
                <Sidebar project={ project } />
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
                        onChange={ this.handleInputChange }
                        value={ this.state.project.name }
                      />
                    </div>

                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="deploy_on_push"
                            value="1"
                            onChange={ this.handleInputChange }
                            checked={ this.state.project.deploy_on_push }
                          /> Deploy when code is pushed to
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <Button
                        color="primary"
                        onClick={ this.handleProjectUpdateClick }
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
                      onClick={ this.handleShowDeleteProjectModalClick }
                    >Delete Project</Button>
                  </PanelBody>
                </Panel>
              </Grid>
            </div>
          </Container>

          <DeleteProjectModal
            isVisible={ isDeleteProjectModalVisible }
            onModalHide={ this.handleHideDeleteProjectModalClick }
            onDeleteProjectClick={ this.handleProjectDeleteClick }
          />
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