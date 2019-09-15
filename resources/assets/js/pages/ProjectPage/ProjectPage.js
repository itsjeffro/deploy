import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Deploy } from '../../config';

import { projectSuccess } from '../../state/project/projectActions';
import { createToast } from '../../state/alert/alertActions';

import Alert from '../../components/Alert';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';

import ProjectDetails from './ProjectDetails';
import DeploymentDetails from './DeploymentDetails';
import DeploymentsTable from './DeploymentsTable';
import ServersTable from './ServersTable';

import ProjectService from '../../services/Project';
import ProjectDeploymentService from '../../services/ProjectDeployment';
import ProjectRedeploymentService from '../../services/ProjectRedeployment';
import ProjectKeyService from '../../services/ProjectKey';
import ProjectServerConnectionService from '../../services/ProjectServerConnection';
import ProjectServerService from '../../services/ProjectServer';
import RepositoryTagBranchService from '../../services/RepositoryTagBranch';
import Layout from "../../components/Layout";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      deploy: {
        reference: 'default',
        name: ''
      },
      redeploy: {
        commit: '',
        deployment_id: 0
      },
      project: {},
      projectKey: '',
      deployments: [],
      servers: [],
      server: {},
      tags: [],
      branches: []
    };
  }

  componentDidMount() {
    const projectService = new ProjectService;
    const {
      dispatch,
      match: {
        params: {
          project_id
        }
      }
    } = this.props;

    projectService
      .get(project_id)
      .then(response => {
        dispatch(projectSuccess(response.data));

        this.setState({
          isFetching: false,
          servers: response.data.servers,
          projectKey: response.data.key
        });
      });

    const projectDeploymentService = new ProjectDeploymentService;

    projectDeploymentService
      .index(project_id)
      .then(response => {
        this.setState({ deployments: response.data });
      });

    Echo.private('project.' + project_id)
      .listen('.Deploy\\Events\\DeploymentDeploying', e => {
        this.setState(state => {
          const deployments = [e.deployment].concat(state.deployments.slice(0, 4));
          return {deployments: deployments}
        });
      })
      .listen('.Deploy\\Events\\DeploymentFinished', e => {
         this.setState(state => {
          const deployments = this.updateDeploymentStatus(state.deployments, e.deployment);

          return {deployments: deployments}
        });
      })
      .listen('.Deploy\\Events\\ServerConnectionTested', e => {
        this.setState(state => {
          let servers = this.updateServerConnection(state.servers, e.server);
          return {servers: servers}
        });
      });
  }

  /**
   * Refreshes project deployment hook key.
   */
  handleRefreshKey = () => {
    const { project } = this.props;
    let projectKeyService = new ProjectKeyService;

    projectKeyService
      .put(project.id)
      .then(response => {
        this.setState({projectKey: response.data.key});
      });
  };

  /**
   * Displays deploy modal.
   */
  handleDeployModal = () => {
    const { project } = this.props;
    const repositoryTagBranchService = new RepositoryTagBranchService;

    repositoryTagBranchService
      .get(project.provider_id, project.repository)
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

    const { project } = this.props;
    const projectServerConnectionService = new ProjectServerConnectionService;

    this.setState(state => {
      const servers = this.updateServerConnection(state.servers, {
        id: server_id,
        connection_status: 2
      });

      return {servers: servers}
    });

    projectServerConnectionService
      .get(project.id, server_id);
  };

  /**
   * Handles processing the deployment when the button is clicked.
   */
  handleDeploymentClick = () => {
    const { project } = this.props;
    const { deploy } = this.state;
    const projectDeploymentService = new ProjectDeploymentService;

    let reference = deploy.reference == 'default' ? 'branch' : deploy.reference;
    let name = deploy.reference == 'default' ? project.branch : deploy.name;

    projectDeploymentService
      .create(project.id, {
        reference: reference,
        name: name
      })
      .then(response => {
        $('#deploy-modal').modal('hide');
      },
      error => {
        alert('Could not deploy');
      });
  };

  /**
   * Handles processing the redeployment when the button is clicked.
   */
  handleRedeploymentClick = () => {
    const { redeploy } = this.state;
    const projectRedeploymentService = new ProjectRedeploymentService;

    projectRedeploymentService
      .create({
        deployment_id: redeploy.deployment_id
      })
      .then(response => {
        $('#redeploy-modal').modal('hide');
      },
      error => {
        alert('Could not redeploy');
      });
  };

  /**
   * Handles processing the removal of the server from the project when the button is clicked.
   */
  handleRemoveServerClick = () => {
    const { server } = this.state;
    const { dispatch } = this.props;
    const projectServerService = new ProjectServerService;

    projectServerService
      .delete(server.project_id, server.id)
      .then(response => {
        this.removeServer(server.id);

        dispatch(createToast('Server removed successully.'));

        $('#server-remove-modal').modal('hide');
      },
      error => {
        alert('Could not delete server #' + server.id);
      });
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
   * @param previousDeployments
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
      deployments,
      servers,
      server,
      branches,
      tags,
      projectKey
    } = this.state;

    const {
        project
    } = this.props;

    return (
      <Layout
        project={project}
      >
        <div className="content">
          <div className="container-fluid heading">
            <div className="pull-left">
              <h2>{project.name}</h2>
            </div>
            <div className="pull-right">
              <Link
                className="btn btn-default"
                to={'/projects/' + project.id + '/edit'}
              >
                <Icon iconName="gear" /> Settings
              </Link>
              {servers.length > 0
              ? <Button
                color="primary"
                onClick={this.handleDeployModal}
                style={{marginLeft: 5}}
              >
                <Icon iconName="cloud-upload" /> Deploy
              </Button>
              : ''}
            </div>
          </div>

          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-md-6">
                <ProjectDetails
                  project={project}
                />
              </div>

              <div className="col-xs-12 col-md-6">
                <DeploymentDetails
                  project={project}
                />
              </div>
            </div>

            <Panel>
              <PanelHeading>
              <div className="pull-right">
                <Link
                  className="btn btn-default"
                  to={'/projects/' + project.id + '/servers/create'}
                ><Icon iconName="plus" /> Add Server</Link>
              </div>
                <PanelTitle>Servers</PanelTitle>
              </PanelHeading>
              {this.renderServers(servers)}
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployments</PanelTitle>
              </PanelHeading>
              {this.renderDeployments(deployments)}
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>Deployment info</PanelTitle>
              </PanelHeading>
              <PanelBody>
                <p>Make requests to the following URL to trigger deployments for this project.</p>
                <pre>{Deploy.url + Deploy.path + '/webhook/' + projectKey}</pre>
                <Button
                  onClick={this.handleRefreshKey}
                >Refresh key</Button>
              </PanelBody>
            </Panel>
          </div>

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
                /> Default Branch ({project.branch})
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
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectPage);
