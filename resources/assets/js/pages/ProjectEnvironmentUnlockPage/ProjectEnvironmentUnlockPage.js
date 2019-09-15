import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProjectEnvironmentUnlockService from '../../services/ProjectEnvironmentUnlock';
import ProjectEnvironmentService from '../../services/ProjectEnvironment';

import {fetchProject} from '../../state/project/projectActions';

import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Grid from '../../components/Grid';
import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';
import TextField from '../../components/TextField';

import EnvironmentServersTable from './EnvironmentServersTable';

import { buildAlertFromResponse } from '../../utils/alert';
import Layout from "../../components/Layout";

class ProjectEnvironmentUnlockPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      environment: {
        key: '',
        contents: '',
        servers: [],
      },
      errors: [],
      syncStatus: '',
      unlocked: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSyncServerClick = this.handleSyncServerClick.bind(this);
  }

  /**
   * Fetch project through dispatch during componentWillMount cycle.
   * Listen for environment updates when component has mounted.
   */
  componentDidMount() {
    const {
      dispatch,
      project,
      match,
    } = this.props;

    this.setState(prevState => {
      const environment = {
        ...prevState.environment,
        servers: project.environment_servers.map(server => {
          return server.server_id;
        }, []),
      };

      return {environment: environment};
    });

    if (typeof project === 'object' && Object.keys(project).length === 0) {
      dispatch(fetchProject(match.params.project_id));
    }

    Echo.private('project.' + project.id)
      .listen('.Deploy\\Events\\EnvironmentSyncing', (e) => {
        let environment = e.environment.id;
        this.setState({syncStatus: 'Syncing'});
      })
      .listen('.Deploy\\Events\\EnvironmentSynced', (e) => {
        let environment = e.environment.id;
        this.setState({syncStatus: 'Synced'});

        setTimeout(() => {
          this.setState({syncStatus: ''});
        }, 300);
      });
  }

  /**
   * Handle input change.
   *
   * @param {object} event
   */
  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState(state => {
      let environment = Object.assign({}, state.environment, {
        [name]: value
      });
      return {environment: environment}
    });
  }

  /**
   * Handle environment unlock click.
   */
  handleClick() {
    const {environment} = this.state;
    const {project} = this.props;
    const projectEnvironmentUnlockService = new ProjectEnvironmentUnlockService;

    projectEnvironmentUnlockService
      .post(project.id, environment)
      .then(response => {
      	this.setState({errors: []});

        this.setState(state => {
          let environment = Object.assign({}, state.environment, response.data);

          return {
            environment: environment,
            unlocked: true
          }
        });
      },
      error => {
        this.setState({
          errors: buildAlertFromResponse(error.response)
        });
      });
  }

  /**
   * Handle environment update click.
   */
  handleUpdateClick() {
    const {project} = this.props;
    const {environment} = this.state;
    const projectEnvironmentService = new ProjectEnvironmentService;

    projectEnvironmentService
      .put(project.id, environment)
      .then(response => {
        this.setState({
          errors: []
        });
      },
      error => {
        this.setState({
          errors: buildAlertFromResponse(error.response)
        });
      });
  }

  /**
   * Handle cancel environment update click.
   */
  handleCancelClick() {
    this.setState(state => {
      let environment = Object.assign({}, state.environment, {
        key: null,
        contents: null
      });

      return {
        environment: environment,
        unlocked: false
      }
    });
  }

  /**
   * Handle click for adding to servers that should be synced.
   *
   * @param {int} server_id
   */
  handleSyncServerClick(serverId) {
    this.setState(prevState => {
      let environmentServers = prevState.environment.servers;

      if (environmentServers.indexOf(serverId) === -1) {
        environmentServers.push(serverId);
      } else {
        environmentServers = environmentServers.filter(environmentServer => {
          return environmentServer !== serverId;
        });
      }

      const environment = {
        ...prevState.environment,
        servers: environmentServers,
      };

      return {environment: environment};
    });
  }

  /**
   * @param {Array} environmentServers
   * @returns {Array}
   */
  mapEnvironmentServers(environmentServers) {
    return (environmentServers||[]).map(environmentServer => {
      return parseInt(environmentServer.server_id);
    });
  }

  render() {
    const {
      environment,
      errors,
      syncStatus,
      unlocked
    } = this.state;

    const {
      project,
      isFetching
    } = this.props;

    if (isFetching) {
      return (
        <div>
          {this.renderBreadcrumbs(project)}
          <Loader />
        </div>
      )
    }

    if (unlocked) {
      return (
        <Layout project={project}>
          <div className="content">
            <div className="container-fluid heading">
              <h2>
                Environment
              </h2>
            </div>

            <div className="container-fluid">
              <Alert type="warning">
                Your environment information will be stored in an .env file on your servers.
              </Alert>

              <div className="row">
                <Grid xs={12} md={8}>
                  <Panel>
                    <PanelBody>
                      {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

                      <TextField
                        label="Key"
                        name="key"
                        type="password"
                        onChange={this.handleInputChange}
                        value={environment.key}
                      />

                      <div className="form-group">
                        <label>Contents</label>
                        <textarea
                          className="form-control"
                          name="contents"
                          onChange={this.handleInputChange}
                          rows="6"
                          style={{fontFamily: 'monospace', resize: 'vertical'}}
                          defaultValue={environment.contents}
                        />
                      </div>

                      <Button
                        onClick={this.handleCancelClick}
                        style={{marginRight: 5}}
                      >Cancel</Button>

                      <Button
                        onClick={this.handleUpdateClick}
                      >Update Environment</Button>
                    </PanelBody>
                  </Panel>
                </Grid>

                <Grid xs={12} md={4}>
                  <EnvironmentServersTable
                    project={project}
                    syncedServers={environment.servers}
                    syncStatus={syncStatus}
                    onSyncServerClick={this.handleSyncServerClick}
                  />
                </Grid>
              </div>
            </div>
          </div>
        </Layout>
      )
    }

    return (
      <Layout project={project}>
        <div className="content">
          <div className="container-fluid heading">
            <h2>
              Environment
            </h2>
          </div>

          <div className="container-fluid">
            <Alert type="warning">
              Your environment information will be encrypted on our server using your
              chosen key. You will also have to provide your key each time you wish to
              update your information.
              <br/><br/>
              Please keep in mind that we do not store your key and have no way of
              retrieving it. Therefore if you forget your key, you will need to reset your key which will also
              result in any previous encrypted environment information being cleared
              from our server.
            </Alert>

            <Panel>
              <PanelBody>
                {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

                <div className="form-group">
                  <TextField
                    label="Key"
                    name="key"
                    type="password"
                    onChange={this.handleInputChange}
                    value={environment.key}
                  />
                </div>

                <div className="form-group">
                  <Button
                    onClick={this.handleClick}
                  >Unlock Environment</Button>
                </div>

                <Link
                  to={'/projects/' + project.id + '/environment-reset'}
                >Need to reset your key?</Link>
              </PanelBody>
            </Panel>
          </div>
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
)(ProjectEnvironmentUnlockPage)
