import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Deploy } from '../../config';

import { projectSuccess } from '../../actions/project';

import Alert from '../../components/Alert';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelBody from '../../components/PanelBody';
import Modal from '../../components/Modal';

import ProjectDetails from './ProjectDetails';
import DeploymentDetails from './DeploymentDetails';
import SubMenu from './SubMenu';
import DeploymentsTable from './DeploymentsTable';
import ServersTable from './ServersTable';

import ProjectService from '../../services/Project';
import ProjectDeploymentService from '../../services/ProjectDeployment';
import ProjectRedeploymentService from '../../services/ProjectRedeployment';
import ProjectKeyService from '../../services/ProjectKey';
import ProjectServerConnectionService from '../../services/ProjectServerConnection';
import ProjectServerService from '../../services/ProjectServer';
import RepositoryTagBranchService from '../../services/RepositoryTagBranch';

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

    this.handleRefreshKey = this.handleRefreshKey.bind(this);
    this.handleDeployModal = this.handleDeployModal.bind(this);
    this.handleRedeployModal = this.handleRedeployModal.bind(this);
    this.handleServerRemoveModal = this.handleServerRemoveModal.bind(this);
    this.handleServerKeyModal = this.handleServerKeyModal.bind(this);
    this.handleServerConnectionTestClick = this.handleServerConnectionTestClick.bind(this);
    this.handleReferenceChange = this.handleReferenceChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDeploymentClick = this.handleDeploymentClick.bind(this);
    this.handleRedeploymentClick = this.handleRedeploymentClick.bind(this);
    this.handleRemoveServerClick = this.handleRemoveServerClick.bind(this);
  }

  componentWillMount() {
    const { project_id } = this.props.match.params;
    const projectService = new ProjectService;
    const { dispatch } = this.props;

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
        this.setState({
          deployments: response.data
        });
      });
  }

  componentDidMount() {
    const { project_id } = this.props.match.params;

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

  handleRefreshKey() {
    const { project } = this.props;
    let projectKeyService = new ProjectKeyService;

    projectKeyService
      .put(project.id)
      .then(response => {
        this.setState({projectKey: response.data.key});
      });
  }

  handleDeployModal() {
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
  }

  handleRedeployModal(event, deployment) {
    this.setState(state => {
      let redeploy = Object.assign({}, state.redeploy, {
        commit: deployment.commit,
        deployment_id: deployment.id
      });
      return {redeploy: redeploy}
    });

    $('#redeploy-modal').modal('show');
  }

  handleServerRemoveModal(server) {
    this.setState({server: server});
    $('#server-remove-modal').modal('show');
  }

  handleServerKeyModal(server) {
    this.setState({server: server});
    $('#server-key-modal').modal('show');
  }

  handleReferenceChange(event) {
    const reference = event.target.value;
    const { tags, branches } = this.state;

    let name = '';

    if (reference == 'tag') {
        name = tags[0].name;
    } else if (reference == 'branch') {
        name = branches[0].name;
    }

    let deploy = Object.assign({}, this.state.deploy, {
      reference: reference,
      name: name
    });

    this.setState({deploy: deploy});
  }

  handleNameChange(event) {
    let deploy = Object.assign({}, this.state.deploy, {
      name: event.target.value
    });

    this.setState({deploy: deploy});
  }

  handleServerConnectionTestClick(event, server_id) {
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
  }

  handleDeploymentClick() {
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
  }

  handleRedeploymentClick() {
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
  }

  handleRemoveServerClick() {
    const { server } = this.state;
    const projectServerService = new ProjectServerService;

    projectServerService
      .delete(server.project_id, server.id)
      .then(response => {
        this.removeServer(server.id);

        $('#server-remove-modal').modal('hide');
      },
      error => {
        alert('Could not delete server #' + server.id);
      });
  }

  removeServer(server_id) {
    this.setState(state => {
      const servers = state.servers.filter(server => {
        return server.id !== server_id;
      });
      return {servers: servers}
    });
  }

  updateServerConnection(prevServers, server) {
    return prevServers.map(prevServer => {
      if (prevServer.id === server.id) {
        return Object.assign({}, prevServer, {connection_status: server.connection_status});
      }
      return Object.assign({}, prevServer);
    });
  }

  updateDeploymentStatus(previousDeployments, deployment) {
    return previousDeployments.map(previousDeployment => {
      if (previousDeployment.id === deployment.id) {
        return Object.assign({}, previousDeployment, {status: deployment.status});
      }
      return Object.assign({}, previousDeployment);
    });
  }

  renderDeployments(deployments) {
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
  }

  renderServers(servers) {
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
  }

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
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">{project.name}</span>
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
        </div>

        <SubMenu
          project={project}
        />

        <div className="container content">
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
              Servers
            </PanelHeading>
            <div className="panel-body text-right">
              <Link
                className="btn btn-default"
                to={'/projects/' + project.id + '/servers/create'}
              ><Icon iconName="plus" /> Add Server</Link>
            </div>
            {this.renderServers(servers)}
          </Panel>

          <Panel>
            <PanelHeading>
              Deployments
            </PanelHeading>
            {this.renderDeployments(deployments)}
          </Panel>

          <Panel>
            <PanelHeading>
              Deployment info
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
                selectedValue={deploy.name}
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
                selectedValue={deploy.name}
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
    )
  }
}

const mapStateToProps = state => {
  return state.project;
};

export default connect(
  mapStateToProps
)(ProjectPage);