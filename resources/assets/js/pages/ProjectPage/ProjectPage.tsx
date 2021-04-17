import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  fetchProjectDeployments,
  createProjectDeployment,
  createProjectRedeployment,
  projectDeploymentDeploying,
  projectDeploymentDeployed
} from "../../state/projectDeployments/actions";
import { Deploy } from '../../config';
import { fetchProject } from '../../state/project/actions';
import { updateProjectKey } from '../../state/project/actions';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import RepositoryTagBranchService from '../../services/RepositoryTagBranch';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import Grid from '../../components/Grid';
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import ProjectDetails from './components/ProjectDetails';
import DeploymentDetails from './components/DeploymentDetails';
import DeploymentsTable from './components/DeploymentsTable';
import ServersTable from './components/ServersTable';
import DeploymentModal from './components/DeploymentModal';
import RedeploymentModal from './components/RedeploymentModal';
import RemoveServerModal from './components/RemoveServerModal';
import ServerKeyModal from '../../components/ServerKeyModal';
import ProjectServerApi from "../../services/Api/ProjectServerApi";
import { fetchMe } from "../../state/auth/authActions";
import { testServerConnection } from "../../state/servers/actions";
import {createToast} from "../../state/alert/alertActions";

class ProjectPage extends React.Component<any, any> {
  state = {
    deploy: {
      reference: 'default',
      name: ''
    },
    redeploy: {
      commit: '',
      deployment_id: 0
    },
    server: {
      id: null,
      project_id: null,
    },
    projectServers: [],
    deployments: [],
    tags: [],
    branches: [],
    isServerKeyModalVisible: false,
    isRemoveServerModalVisible: false,
    isDeploymentModalVisible: false,
    isRedeploymentModalVisible: false,
    isAddServerModalVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    dispatch(fetchProject(project_id));
    dispatch(fetchProjectDeployments(project_id));
    dispatch(fetchMe());

    const projectServerApi = new ProjectServerApi();

    projectServerApi
      .list(project_id)
      .then((response) => this.setState({ projectServers: response.data }))
      .catch((error) => console.log(error.response))
  }

  /**
   * Update state when component props update.
   */
  componentWillReceiveProps(nextProps: any): void {
    const { auth } = this.props;

    if (nextProps.auth.user !== auth.user && nextProps.auth.user) {
      const user = nextProps.auth.user;

      this.listenForEvents(user.id);
    }
  }

  /**
   * Listen for Echo related events.
   */
  listenForEvents = (userId: number): void => {
    const { dispatch } = this.props;
    const echoWindow: any = window;
    const Echo = echoWindow.Echo;

    if (Echo !== null) {
      Echo
        .private(`user.${ userId }`)
        .listen('.Deploy\\Events\\DeploymentDeploying', e => {
          dispatch(projectDeploymentDeploying(e.deployment));
        })
        .listen('.Deploy\\Events\\DeploymentFinished', e => {
          dispatch(projectDeploymentDeployed(e.deployment));
        })
        .listen('.Deploy\\Events\\ServerConnectionTested', e => {
          this.updateServerConnectionStatus(e.server.id, e.server.connection_status);
        });
    }
  }

  /**
   * Update server status.
   */
  updateServerConnectionStatus = (serverId: number, connectionStatus: number) => {
    this.setState((prevState) => {
      const projectServers = prevState.projectServers.map((projectServer) => {
        if (projectServer.server_id !== serverId) {
          return projectServer;
        }

        return {
          ...projectServer,
          server: {
            ...projectServer.server,
            connection_status: connectionStatus,
          },
        }
      });

      return { projectServers: projectServers };
    })
  }

  /**
   * Refreshes project deployment hook key.
   */
  handleRefreshKey = (): void => {
    const { dispatch, project } = this.props;

    dispatch(updateProjectKey(project.item.id));
  };

  /**
   * Displays deploy modal.
   */
  handleShowDeployModalClick = (): void => {
    const { project } = this.props;
    const repositoryTagBranchService = new RepositoryTagBranchService;

    repositoryTagBranchService
      .get(project.item.provider_id, project.item.repository)
      .then((response) => {
        this.setState({
          branches: response.data.branches,
          tags: response.data.tags
        });
      });

    this.setState({ isDeploymentModalVisible: true });
  };

  /**
   * Displays redeploy modal.
   */
  handleRedeployModal = (deployment: any): void => {
    const { redeploy } = this.state;

    const deploy = {
      ...redeploy,
      commit: deployment.commit,
      deployment_id: deployment.id,
    };

    this.setState({
      isRedeploymentModalVisible: true,
      redeploy: deploy
    });
  };

  /**
   * Displays server delete confirmation modal.
   */
  handleServerRemoveModal = (server: object): void => {
    this.setState({
      isRemoveServerModalVisible: true,
      server: server,
    });
  };

  /**
   * Displays server ssh key modal.
   */
  handleServerKeyModal = (server: object): void => {
    this.setState({
      isServerKeyModalVisible: true,
      server: server,
    });
  };

  /**
   * Hide modal.
   */
  handleHideDeployModal = (): void => {
    this.setState({ isDeploymentModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideRedeployModal = (): void => {
    this.setState({ isRedeploymentModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideServerRemoveModal = (): void => {
    this.setState({ isRemoveServerModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideServerKeyModal = (): void => {
    this.setState({ isServerKeyModalVisible: false });
  }

  /**
   * Handles changing the reference (tag or branch) type to deploy.
   */
  handleReferenceChange = (event: any): void => {
    const reference = event.target.value;
    const { tags, branches, deploy } = this.state;

    let name = '';

    if (reference === 'tag') {
        name = tags[0].name;
    } else if (reference === 'branch') {
        name = branches[0].name;
    }

    this.setState({
      deploy: {
        ...deploy,
        reference: reference,
        name: name,
      }
    });
  };

  /**
   * Handles setting the refernece (tag or branch) name to deploy.
   */
  handleNameChange = (event: any): void => {
    const { deploy } = this.state;

    this.setState({
      deploy: {
        ...deploy,
        name: event.target.value,
      }
    });
  };

  /**
   * Handles testing the server connection.
   */
  handleServerConnectionTestClick = (event: any, server_id: number): void => {
    event.preventDefault();

    const { dispatch } = this.props;

    this.updateServerConnectionStatus(server_id, 2);

    dispatch(testServerConnection(server_id));
  };

  /**
   * Handles processing the deployment when the button is clicked.
   */
  handleDeploymentClick = (): void => {
    const { dispatch, project } = this.props;
    const { deploy } = this.state;

    let reference = deploy.reference === 'default' ? 'branch' : deploy.reference;
    let name = deploy.reference === 'default' ? project.item.branch : deploy.name;

    dispatch(createProjectDeployment(project.item.id, {
      reference: reference,
      name: name
    }));

    this.handleHideDeployModal();
  };

  /**
   * Handles processing the redeployment when the button is clicked.
   */
  handleRedeploymentClick = (): void => {
    const { dispatch } = this.props;
    const { redeploy } = this.state;

    dispatch(createProjectRedeployment(redeploy.deployment_id));

    this.handleHideRedeployModal();
  };

  /**
   * Handles processing the removal of the server from the project when the button is clicked.
   */
  handleRemoveServerClick = (): void => {
    const { server } = this.state;
    const { project, dispatch } = this.props;

    const projectServerApi = new ProjectServerApi;

    projectServerApi
      .delete(project.item.id, server.id)
      .then((response) => {
        this.handleHideServerRemoveModal();

        this.setState((prevState) => {
          const projectServers = prevState.projectServers.filter((projectServer) => {
            return projectServer.id != server.id
          });

          return { projectServers: projectServers };
        });

        dispatch(createToast('Server removed successfully.'));
      })
      .catch((error) => console.log(error.response));
  };

  /**
   * Updates specified deployment status in table.
   */
  updateDeploymentStatus = (previousDeployments: any[], deployment: any): any[] => {
    return previousDeployments.map((previousDeployment) => {
      if (previousDeployment.id === deployment.id) {
        return {
          ...previousDeployment,
          status: deployment.status,
        };
      }

      return { ...previousDeployment };
    });
  };

  /**
   * Show "add server" modal.
   */
  handleShowAddServerModal = () => {
    this.setState({ isAddServerModalVisible: true });
  };

  /**
   * Show "add server" modal.
   */
  handleHideAddServerModal = () => {
    this.setState({ isAddServerModalVisible: false });
  };

  /**
   * Render component.
   */
  render() {
    const {
      deploy,
      redeploy,
      server,
      branches,
      tags,
      projectServers,
      isDeploymentModalVisible,
      isRedeploymentModalVisible,
      isServerKeyModalVisible,
      isRemoveServerModalVisible,
    } = this.state;

    const { project, deployments } = this.props;

    return (
      <Layout
        project={ project.item }
      >
        <ProjectHeading project={ project.item }>
          <>
            {project.item.servers.length > 0
            ? <Button
              color="primary"
              onClick={ this.handleShowDeployModalClick }
              style={{ marginLeft: 5 }}
            >
              <Icon iconName="cloud-upload" /> Deploy
            </Button>
            : ''}
          </>
        </ProjectHeading>

        <div className="content">
          <Container fluid>
            <div className="row">
              <Grid xs={ 12 } md={ 6 }>
                <ProjectDetails
                  project={ project.item }
                />
              </Grid>

              <Grid xs={ 12 } md={ 6 }>
                <DeploymentDetails
                  project={ project.item }
                />
              </Grid>
            </div>

            <Panel>
              <PanelHeading>
                <div className="pull-right">
                  <Link
                    className="btn btn-default"
                    to={ `/projects/${project.item.id}/servers/create` }
                  ><Icon iconName="plus" /> Add Server</Link>
                </div>
                <PanelTitle>Servers</PanelTitle>
              </PanelHeading>

              <ServersTable
                projectId={ project.item.id }
                projectServers={ projectServers }
                onServerConnectionTestClick={ this.handleServerConnectionTestClick }
                onServerRemoveClick={ this.handleServerRemoveModal }
                onServerKeyClick={ this.handleServerKeyModal }
              />
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployments</PanelTitle>
              </PanelHeading>
              
              <DeploymentsTable
                deployments={ deployments.items }
                onRedeployClick={ this.handleRedeployModal }
              />
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployment info</PanelTitle>
              </PanelHeading>

              <PanelBody>
                <p>Make requests to the following URL to trigger deployments for this project.</p>
                <pre>{ Deploy.url + '/' + Deploy.path + '/webhook/' + project.item.key }</pre>
                <Button
                  onClick={ this.handleRefreshKey }
                >{ project.isKeyUpdating ? 'Working...' : 'Refresh key' }</Button>
              </PanelBody>
            </Panel>
          </Container>

          <DeploymentModal
            isVisible={ isDeploymentModalVisible }
            onModalHide={ this.handleHideDeployModal }
            onDeploymentClick={ this.handleDeploymentClick }
            onReferenceChange={ this.handleReferenceChange }
            onNameChange={ this.handleNameChange }
            deploy={ deploy }
            project={ project.item }
            branches={ branches }
            tags={ tags }
          />

          <RedeploymentModal
            isVisible={ isRedeploymentModalVisible }
            onModalHide={ this.handleHideRedeployModal }
            onRedeploymentClick={ this.handleRedeploymentClick }
            redeploy={ redeploy }
          />

          <RemoveServerModal
            isVisible={ isRemoveServerModalVisible }
            onModalHide={ this.handleHideServerRemoveModal }
            onRemoveServerClick={ this.handleRemoveServerClick }
          />

          <ServerKeyModal
            isVisible={ isServerKeyModalVisible }
            onModalHide={ this.handleHideServerKeyModal }
            server={ server }
          />
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
    deployments: state.projectDeployments,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ProjectPage);
