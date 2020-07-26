import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Deploy } from '../../config';
import { fetchProject } from '../../state/project/actions';
import { updateProjectKey } from '../../state/project/actions/key';
import { testServerConnection, updateServerConnectionStatus } from '../../state/project/actions/serverConnectionTest';
import { removeProjectServer } from '../../state/project/actions/removeProjectServer';
import {
  fetchProjectDeployments,
  createProjectDeployment,
  createProjectRedeployment,
  projectDeploymentDeploying,
  projectDeploymentDeployed
} from "../../state/projectDeployments/actions";

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
import ServerKeyModal from './components/ServerKeyModal';

class ProjectPage extends React.Component {
  state = {
    deploy: {
      reference: 'default',
      name: ''
    },
    redeploy: {
      commit: '',
      deployment_id: 0
    },
    server: {},
    deployments: [],
    tags: [],
    branches: [],
    isServerKeyModalVisible: false,
    isRemoveServerModalVisible: false,
    isDeploymentModalVisible: false,
    isRedeploymentModalVisible: false,
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

    this.listenForEvents(project_id);
  }

  /**
   * Listen for project related events.
   *
   * @param {number} projectId
   */
  listenForEvents = (projectId) => {
    const { dispatch } = this.props;

    if (Echo !== null) {
      Echo
        .private('project.' + projectId)
        .listen('.Deploy\\Events\\DeploymentDeploying', e => {
          dispatch(projectDeploymentDeploying(e.deployment));
        })
        .listen('.Deploy\\Events\\DeploymentFinished', e => {
          dispatch(projectDeploymentDeployed(e.deployment));
        })
        .listen('.Deploy\\Events\\ServerConnectionTested', e => {
          dispatch(updateServerConnectionStatus(e.server.id, e.server.connection_status));
        });
    }
  }

  /**
   * Refreshes project deployment hook key.
   */
  handleRefreshKey = () => {
    const { dispatch, project } = this.props;

    dispatch(updateProjectKey(project.item.id));
  };

  /**
   * Displays deploy modal.
   */
  handleShowDeployModalClick = () => {
    const { project } = this.props;
    const repositoryTagBranchService = new RepositoryTagBranchService;

    repositoryTagBranchService
      .get(project.item.provider_id, project.item.repository)
      .then(response => {
        this.setState({
          branches: response.data.branches,
          tags: response.data.tags
        });
      });

    this.setState({ isDeploymentModalVisible: true });
  };

  /**
   * Displays redeploy modal.
   *
   * @param event
   * @param deployment
   */
  handleRedeployModal = (event, deployment) => {
    this.setState(state => {
      let redeploy = Object.assign({}, state.redeploy, {
        commit: deployment.commit,
        deployment_id: deployment.id,
      });

      return {
        isRedeploymentModalVisible: true,
        redeploy: redeploy 
      }
    });
  };

  /**
   * Displays server delete confirmation modal.
   *
   * @param {object} server
   */
  handleServerRemoveModal = (server) => {
    this.setState({
      isRemoveServerModalVisible: true,
      server: server,
    });
  };

  /**
   * Displays server ssh key modal.
   *
   * @param {object} server
   */
  handleServerKeyModal = (server) => {
    this.setState({
      isServerKeyModalVisible: true,
      server: server,
    });
  };

  /**
   * Hide modal.
   */
  handleHideDeployModal = () => {
    this.setState({ isDeploymentModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideRedeployModal = () => {
    this.setState({ isRedeploymentModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideServerRemoveModal = () => {
    this.setState({ isRemoveServerModalVisible: false });
  }

  /**
   * Hide modal.
   */
  handleHideServerKeyModal = () => {
    this.setState({ isServerKeyModalVisible: false });
  }

  /**
   * Handles changing the repository reference when deploying.
   *
   * @param event
   */
  handleReferenceChange = (event) => {
    const reference = event.target.value;
    const { tags, branches } = this.state;

    let name = '';

    if (reference === 'tag') {
        name = tags[0].name;
    } else if (reference === 'branch') {
        name = branches[0].name;
    }

    let deploy = Object.assign({}, this.state.deploy, {
      reference: reference,
      name: name
    });

    this.setState({ deploy: deploy });
  };

  /**
   * @param event
   */
  handleNameChange = (event) => {
    let deploy = Object.assign({}, this.state.deploy, {
      name: event.target.value
    });

    this.setState({ deploy: deploy });
  };

  /**
   * Handles testing the server connection.
   *
   * @param event
   * @param server_id
   */
  handleServerConnectionTestClick = (event, server_id) => {
    event.preventDefault();

    const { dispatch, project } = this.props;

    dispatch(testServerConnection(project.item.id, server_id));
  };

  /**
   * Handles processing the deployment when the button is clicked.
   */
  handleDeploymentClick = () => {
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
  handleRedeploymentClick = () => {
    const { dispatch } = this.props;
    const { redeploy } = this.state;

    dispatch(createProjectRedeployment(redeploy.deployment_id));

    this.handleHideRedeployModal();
  };

  /**
   * Handles processing the removal of the server from the project when the button is clicked.
   */
  handleRemoveServerClick = () => {
    const { server } = this.state;
    const { dispatch } = this.props;

    dispatch(removeProjectServer(server.project_id, server.id));

    this.handleHideServerRemoveModal();
  };

  /**
   * Remove the specified server from the servers table.
   *
   * @param server_id
   */
  removeServer = (server_id) => {
    this.setState(state => {
      const servers = state.servers.filter(server => {
        return server.id !== server_id;
      });
      return {servers: servers}
    });
  };

  /**
   * Updates specified server in table.
   *
   * @param prevServers
   * @param server
   * @returns {*}
   */
  updateServerConnection = (prevServers, server) => {
    return prevServers.map(prevServer => {
      if (prevServer.id === server.id) {
        return Object.assign({}, prevServer, {connection_status: server.connection_status});
      }
      return Object.assign({}, prevServer);
    });
  };

  /**
   * Updates specified deployment in table.
   *
   * @param {Array} previousDeployments
   * @param deployment
   * @returns {*}
   */
  updateDeploymentStatus = (previousDeployments, deployment) => {
    return previousDeployments.map(previousDeployment => {
      if (previousDeployment.id === deployment.id) {
        return Object.assign({}, previousDeployment, {status: deployment.status});
      }
      return Object.assign({}, previousDeployment);
    });
  };

  render() {
    const {
      deploy,
      redeploy,
      server,
      branches,
      tags,
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
                servers={ project.item.servers }
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
                <pre>{ Deploy.url + Deploy.path + '/webhook/' + project.item.key }</pre>
                <Button
                  onClick={ this.handleRefreshKey }
                >Refresh key</Button>
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
  };
};

export default connect(mapStateToProps)(ProjectPage);
