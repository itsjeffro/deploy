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
import Alert from '../../components/Alert';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';
import RepositoryTagBranchService from '../../services/RepositoryTagBranch';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';
import ProjectDetails from './components/ProjectDetails';
import DeploymentDetails from './components/DeploymentDetails';
import DeploymentsTable from './components/DeploymentsTable';
import ServersTable from './components/ServersTable';

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
    branches: []
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
      Echo.private('project.' + projectId)
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
  handleDeployModal = () => {
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

    $('#deploy-modal').modal('show');
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
        deployment_id: deployment.id
      });
      return {redeploy: redeploy}
    });

    $('#redeploy-modal').modal('show');
  };

  /**
   * Displays server delete confirmation modal.
   *
   * @param server
   */
  handleServerRemoveModal = (server) => {
    this.setState({server: server});
    $('#server-remove-modal').modal('show');
  };

  /**
   * Displays server ssh key modal.
   *
   * @param server
   */
  handleServerKeyModal = (server) => {
    this.setState({server: server});
    $('#server-key-modal').modal('show');
  };

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

    this.setState({deploy: deploy});
  };

  /**
   * @param event
   */
  handleNameChange = (event) => {
    let deploy = Object.assign({}, this.state.deploy, {
      name: event.target.value
    });

    this.setState({deploy: deploy});
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

    $('#deploy-modal').modal('hide');
  };

  /**
   * Handles processing the redeployment when the button is clicked.
   */
  handleRedeploymentClick = () => {
    const { dispatch } = this.props;
    const { redeploy } = this.state;

    dispatch(createProjectRedeployment(redeploy.deployment_id));

    $('#redeploy-modal').modal('hide');
  };

  /**
   * Handles processing the removal of the server from the project when the button is clicked.
   */
  handleRemoveServerClick = () => {
    const { server } = this.state;
    const { dispatch } = this.props;

    dispatch(removeProjectServer(server.project_id, server.id));

    $('#server-remove-modal').modal('hide');
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
   * @param {array} previousDeployments
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

  /**
   * @param deployments
   * @returns {*}
   */
  renderDeployments = (deployments) => {
    if (deployments.length > 0) {
      return (
        <div className="table-responsive">
          <DeploymentsTable
            deployments={deployments}
            onRedeployClick={this.handleRedeployModal}
          />
        </div>
      )
    }

    return (
      <div className="panel-body text-center">
        No deployments made yet
      </div>
    )
  };

  /**
   * @param servers
   * @returns {*}
   */
  renderServers = (servers) => {
    if (servers.length > 0) {
      return (
        <div className="table-responsive">
          <ServersTable
            servers={servers}
            onServerConnectionTestClick={this.handleServerConnectionTestClick}
            onServerRemoveClick={this.handleServerRemoveModal}
            onServerKeyClick={this.handleServerKeyModal}
          />
        </div>
      )
    }
  };

  render() {
    const {
      deploy,
      redeploy,
      server,
      branches,
      tags,
      projectKey
    } = this.state;

    const {
      project,
      deployments
    } = this.props;

    return (
      <Layout
        project={project.item}
      >
        <ProjectHeading project={ project.item }>
          <>
            {project.item.servers.length > 0
            ? <Button
              color="primary"
              onClick={this.handleDeployModal}
              style={{marginLeft: 5}}
            >
              <Icon iconName="cloud-upload" /> Deploy
            </Button>
            : ''}
          </>
        </ProjectHeading>

        <div className="content">
          <Container fluid>
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <ProjectDetails
                  project={project.item}
                />
              </div>

              <div className="col-xs-12 col-md-6">
                <DeploymentDetails
                  project={project.item}
                />
              </div>
            </div>

            <Panel>
              <PanelHeading>
              <div className="pull-right">
                <Link
                  className="btn btn-default"
                  to={'/projects/' + project.item.id + '/servers/create'}
                ><Icon iconName="plus" /> Add Server</Link>
              </div>
                <PanelTitle>Servers</PanelTitle>
              </PanelHeading>
              {this.renderServers(project.item.servers)}
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployments</PanelTitle>
              </PanelHeading>
              {this.renderDeployments(deployments.items)}
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployment info</PanelTitle>
              </PanelHeading>
              <PanelBody>
                <p>Make requests to the following URL to trigger deployments for this project.</p>
                <pre>{Deploy.url + Deploy.path + '/webhook/' + project.item.key}</pre>
                <Button
                  onClick={this.handleRefreshKey}
                >Refresh key</Button>
              </PanelBody>
            </Panel>
          </Container>

          <Modal
            id="deploy-modal"
            title="Deploy Project"
            buttons={[
              {text: 'Cancel', onPress: () => $('#deploy-modal').modal('hide')},
              {text: 'Deploy', onPress: () => this.handleDeploymentClick()}
            ]}
          >
            <label>Deploy From</label>

            <div className="form-group">
              <label>
                <input
                  name="reference"
                  value="default"
                  type="radio"
                  onChange={this.handleReferenceChange}
                  checked={'default' === deploy.reference}
                /> Default Branch ({project.item.branch})
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  name="reference"
                  value="branch"
                  type="radio"
                  onChange={this.handleReferenceChange}
                  checked={'branch' === deploy.reference}
                /> A Different Branch
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  name="reference"
                  value="tag"
                  type="radio"
                  onChange={this.handleReferenceChange}
                  checked={'tag' === deploy.reference}
                /> Tag
              </label>
            </div>
            <div className="form-group">
              <div className="branch-select" style={deploy.reference === 'branch' ? {} : {display: 'none'}}>
                <label htmlFor="branch-select">Branch</label>
                <select
                  className="form-control"
                  name="branch"
                  id="branch-select"
                  onChange={this.handleNameChange}
                >
                {branches.map(branch =>
                  <option
                    key={'branch' + branch.name}
                    value={branch.name}
                  >{branch.name}</option>
                )}
                </select>
              </div>

              <div className="tag-select" style={deploy.reference === 'tag' ? {} : {display: 'none'}}>
                <label htmlFor="tag-select">Tag</label>
                <select
                  className="form-control"
                  name="tag"
                  id="tag-select"
                  onChange={this.handleNameChange}
                >
                {tags.map(tag =>
                  <option
                    key={'tag' + tag.name}
                    value={tag.name}
                  >{tag.name}</option>
                )}
                </select>
              </div>
            </div>
          </Modal>

          <Modal
            id="redeploy-modal"
            title={'Redeploy Commit (' + redeploy.commit.substr(0,7) + ')'}
            buttons={[
              {text: 'Cancel', onPress: () => $('#redeploy-modal').modal('hide')},
              {text: 'Redeploy', onPress: () => this.handleRedeploymentClick()}
            ]}
          >
            Are you sure you want to redeploy this commit?
          </Modal>

          <Modal
            id="server-remove-modal"
            title="Remove Server"
            buttons={[
              {text: 'Cancel', onPress: () => $('#server-remove-modal').modal('hide')},
              {text: 'Remove Server', onPress: () => this.handleRemoveServerClick()}
            ]}
          >
            Are you sure you want to remove this server from the project?
          </Modal>

          <Modal
            id="server-key-modal"
            title="Server Public Key"
            buttons={[
              {text: 'Close', onPress: () => $('#server-key-modal').modal('hide')}
            ]}
          >
            <Alert type="warning">
              This key must be added to the server`s ~/.ssh/authorized_keys file.
            </Alert>
            <div
              className="well"
              style={{margin: 0, overflowWrap: 'break-word'}}
            >
              {server.public_key}
            </div>
          </Modal>
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

export default connect(
  mapStateToProps
)(ProjectPage);
