import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchProjects, deleteProject, updateProject } from '../../state/projects/actions';
import { createToast } from "../../state/alert/alertActions";
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Grid from '../../components/Grid';
import Panel from '../../components/Panel';
import TextField from '../../components/TextField';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import DeleteProjectModal from './components/DeleteProjectModal';
import { fetchAccountProviders } from '../../state/accountProviders/actions';

class ProjectEditPage extends React.Component<any, any> {
  state = {
    project_id: null,
    isDeleted: false,
    isUpdated: false,
    project: {
      id: null,
      name: '',
      releases: '',
      deploy_on_push: false,
      provider_id: null,
      repository: '',
      branch: '',
    },
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

    dispatch(fetchAccountProviders());

    if (projects.items[project_id] !== undefined) {
      this.setState({ project: projects.items[project_id] });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {
      dispatch,
      projects,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    // Handle project change
    if (projects.items !== nextProps.projects.items) {
      this.setState({ project: nextProps.projects.items[project_id] || {} });
    }

    // Handle project delete
    if (nextProps.projects.isDeleted !== projects.isDeleted && nextProps.projects.isDeleted) {
      this.setState({ isDeleteProjectModalVisible: false, isDeleted: true });
    }

    // Handle project update
    if (nextProps.projects.isUpdated !== projects.isUpdated && nextProps.projects.isUpdated) {
      dispatch(createToast('Project updated successfully.'));
    }
  }

  /**
   * Handle project input change.
   */
  handleInputChange = (event: any): void => {
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
  handleProjectUpdateClick = (): void => {
    const { dispatch } = this.props;
    const { project } = this.state;

    const data = {
      name: project.name,
      provider_id: project.provider_id,
      repository: project.repository,
      branch: project.branch,
      releases: project.releases,
      deploy_on_push: project.deploy_on_push,
    };

    dispatch(updateProject(project.id, data));
  };

  /**
   * Handle project delete.
   */
  handleProjectDeleteClick = (): void => {
    const { dispatch } = this.props;
    const { project } = this.state;

    dispatch(deleteProject(project.id));
  };

  /**
   * Show delet project modal.
   */
  handleShowDeleteProjectModalClick = (): void => {
    this.setState({ isDeleteProjectModalVisible: true });
  };

  /**
   * Hide delete project modal.
   */
  handleHideDeleteProjectModalClick = (): void => {
    this.setState({ isDeleteProjectModalVisible: false });
  };

  render = () => {
    const {
      isDeleted,
      isUpdated,
      project,
      isDeleteProjectModalVisible,
    } = this.state;

    const {
      projects,
      accountProviders,
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
              <Grid xs={ 12 }>
                <Panel>
                  <PanelHeading>
                    <PanelTitle>General Settings</PanelTitle>
                  </PanelHeading>
                  <PanelBody>
                    { projects.errors.length ? <AlertErrorValidation errors={ projects.errors } /> : '' }

                    <TextField
                      label="Project name"
                      id="name"
                      onChange={ this.handleInputChange }
                      name="name"
                      value={ this.state.project.name }
                    />

                    <div className="form-group">
                      <label>Project provider</label>

                      { (accountProviders.items || [])
                        .filter((grantedProvider) => grantedProvider.is_connected)
                        .map((grantedProvider) =>
                        <div key={ grantedProvider.id }>
                          <label className="form-control-label" htmlFor={ grantedProvider.name }>
                            <input
                              name="provider_id"
                              type="radio"
                              value={ grantedProvider.id }
                              id={ grantedProvider.name }
                              onChange={ this.handleInputChange }
                              checked={ parseInt(this.state.project.provider_id) === grantedProvider.id }
                            /> { grantedProvider.name }
                          </label>
                        </div>
                      ) }
                    </div>

                    <TextField
                      id="repository"
                      label="Repository"
                      onChange={ this.handleInputChange }
                      name="repository"
                      value={ this.state.project.repository }
                      placeholder="user/repository"
                    />

                    <TextField
                      id="branch"
                      label="Branch"
                      onChange={ this.handleInputChange }
                      name="branch"
                      value={ this.state.project.branch }
                    />

                    <TextField
                      id="releases"
                      label="Releases to keep"
                      onChange={ this.handleInputChange }
                      name="releases"
                      type="number"
                      value={ this.state.project.releases }
                    />

                    <div className="form-group">
                      <label>Deploy on push</label>

                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name="deploy_on_push"
                            value="1"
                            onChange={ this.handleInputChange }
                            checked={ this.state.project.deploy_on_push }
                          /> Deploy when the repository has been pushed to
                        </label>
                      </div>
                    </div>

                    <Button
                      color="primary"
                      onClick={ this.handleProjectUpdateClick }
                    >{ projects.isUpdating ? 'Working...' : 'Save' }</Button>
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

const mapStateToProps = (state) => {
  return {
    projects: state.projects,
    accountProviders: state.accountProviders,
  };
};

export default connect(
  mapStateToProps
)(ProjectEditPage);
