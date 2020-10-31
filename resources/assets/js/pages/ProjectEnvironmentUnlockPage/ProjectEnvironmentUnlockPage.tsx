import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProjectEnvironmentUnlockService from '../../services/ProjectEnvironmentUnlock';
import ProjectEnvironmentService from '../../services/ProjectEnvironment';
import { fetchProject } from '../../state/project/actions';
import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Grid from '../../components/Grid';
import Loader from '../../components/Loader';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';
import TextField from '../../components/TextField';
import EnvironmentServersTable from './components/EnvironmentServersTable';
import { buildAlertFromResponse } from '../../utils/alert';
import Layout from "../../components/Layout";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';

class ProjectEnvironmentUnlockPage extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      environment: {
        key: '',
        contents: '',
        servers: [],
      },
      errors: [],
      status: {},
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
      match
    } = this.props;

    const projectId = match.params.project_id;
    const echoWindow: any = window;
    const Echo = echoWindow.Echo;

    this.setState(prevState => {
      const environment = {
        ...prevState.environment,
        servers: project.item.environment_servers.map(server => {
          return server.server_id;
        }, []),
      };

      return {environment: environment};
    });

    dispatch(fetchProject(projectId));

    if (Echo !== null) {
      Echo.private('project.' + projectId)
        .listen('.Deploy\\Events\\EnvironmentSyncing', (e) => {
          let serverId = e.serverId;
          let serverStatus = e.status;

          this.setState(prevState => {
            const status = {
              ...prevState.status,
              [serverId]: serverStatus
            };

            return { status: status }
          });
        })
        .listen('.Deploy\\Events\\EnvironmentSynced', (e) => {
          let serverId = e.serverId;
          let serverStatus = e.status;

          this.setState(prevState => {
            const status = {
              ...prevState.status,
              [serverId]: serverStatus
            };

            return { status: status }
          });
        });
    }
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
    const { environment } = this.state;
    const { project } = this.props;
    const projectEnvironmentUnlockService = new ProjectEnvironmentUnlockService;

    projectEnvironmentUnlockService
      .post(project.item.id, environment)
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
    const { project } = this.props;
    const { environment } = this.state;
    const projectEnvironmentService = new ProjectEnvironmentService;

    projectEnvironmentService
      .put(project.item.id, environment)
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
      status,
      unlocked
    } = this.state;

    const {
      project
    } = this.props;

    if (project.isFetching) {
      return (
        <Layout project={ project.item }>
          <ProjectHeading project={ project.item } />

          <div className="content">
            <Container fluid>
              <Loader />
            </Container>
          </div>
        </Layout>
      )
    }

    if (unlocked) {
      return (
        <Layout project={project.item}>
          <ProjectHeading project={ project.item } />

          <div className="content">
            <Container fluid>
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
                          rows={ 6 }
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
                    project={ project.item }
                    syncedServers={ environment.servers }
                    status={ status }
                    onSyncServerClick={this.handleSyncServerClick}
                  />
                </Grid>
              </div>
            </Container>
          </div>
        </Layout>
      )
    }

    return (
      <Layout project={project.item}>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
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
                  to={'/projects/' + project.item.id + '/environment-reset'}
                >Need to reset your key?</Link>
              </PanelBody>
            </Panel>
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(
  mapStateToProps
)(ProjectEnvironmentUnlockPage);
