import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'

import { createToast } from '../../state/alert/alertActions';
import { listServers } from "../../state/servers/actions";
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import ProjectHeading from "../../components/ProjectHeading";
import TextField from "../../components/TextField";
import PanelBody from "../../components/PanelBody";
import Grid from "../../components/Grid";
import Project from "../../services/Project";
import ProjectServerApi from "../../services/Api/ProjectServerApi";

class ProjectServerEditPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    isUpdated: false,
    isUpdating: false,
    errors: [],
    initialServer: null,
    server: {
      id: null,
      name: '',
      ip_address: '',
      port: '',
      connect_as: '',
    },
    project: {
      id: null,
      servers: [],
    },
    input: {
      server_id: '',
      project_path: '',
    },
    selectedServer: {
      value: '',
      label: '',
    }
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id,
          server_id,
        },
      },
    } = this.props;

    const projectApi = new Project();

    projectApi.get(project_id)
      .then((response) => this.setState({ project: response.data }))
      .catch((error) => console.log(error.response));

    const projectServerApi = new ProjectServerApi();

    projectServerApi.get(project_id, server_id)
      .then((response) => {
        const projectServer = response.data;

        this.setState({
          initialServer: projectServer.server.id,
          input: {
            server_id: projectServer.server.id,
            project_path: projectServer.project_path,
          },
          selectedServer: {
            value: projectServer.server.id,
            label: projectServer.server.name,
          },
          server: {
            id: projectServer.server.id,
            name: projectServer.server.name,
            ip_address: projectServer.server.ip_address,
            port: projectServer.server.port,
            connect_as: projectServer.server.connect_as,
          }
        })
      })
      .catch((error) => console.log(error.response));

    dispatch(listServers());
  }

  /**
   * Handle input change when creating a server.
   */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState((prevState: any) => {
      const input = {
        ...prevState.input,
        [name]: value
      };

      return { input: input };
    });
  };

  /**
   * Handle click for creating a server.
   */
  handleSaveServerClick = (): void => {
    const { dispatch } = this.props;
    const { input, project, initialServer } = this.state;

    const projectServerApi = new ProjectServerApi();

    this.setState({ isUpdating: true });

    projectServerApi.update(project.id, initialServer, input)
      .then((response) => {
        this.setState({ isUpdated: true, isUpdating: false });

        dispatch(createToast('Server updated successfully.'));
      })
      .catch((error) => {
        this.setState({ errors: error.response, isUpdating: false });
      });
  };

  /**
   * Handle existing server option select change.
   */
  handleServerChange = (option): void => {
    const { servers } = this.props;
    const serverId = option ? option.value : null;
    const server = this.getServerFromList(servers.items, serverId);

    this.setState((prevState) => {
      const selectedServer = {
        ...prevState.selectedServer,
        label: server.name,
        value: server.id,
      };

      return {
        selectedServer: selectedServer,
        server: {
          id: server.id,
          name: server.name,
          ip_address: server.ip_address,
          port: server.port,
          connect_as: server.connect_as,
        },
        input: {
          ...prevState.input,
          server_id: server.id,
          project_path: server.project_path,
        },
      };
    });
  }

  /**
   * Return selected server.
   */
  protected getServerFromList(servers: any[], serverId: number): any {
    const filteredServers = servers.filter((server) => {
      return server.id == serverId;
    });

    if (filteredServers.length === 0) {
      const availableIds = servers.map((server) => server.id).join(', ');

      throw new Error(`Server [${ serverId }] does not exist. Available Ids: ${ availableIds } }`);
    }

    return filteredServers[0]
  }

  /**
   * Render component.
   */
  render() {
    const { servers } = this.props;
    const { project, server, isUpdated, isUpdating, errors, input, selectedServer } = this.state;

    if (isUpdated) {
      return <Redirect to={ `/projects/${ project.id }` } />
    }

    const serverOptions = servers.items.map((server: any) => ({
      label: server.name,
      value: server.id,
    }));

    return (
      <Layout>
        <ProjectHeading project={ project } />

        <div className="content">
          <Container fluid>
            <Panel>
              <PanelHeading>
                <PanelTitle>Edit Server</PanelTitle>
              </PanelHeading>

              <PanelBody>
                { errors.length ? <AlertErrorValidation errors={ errors } /> : '' }

                <div className="form-group">
                  <label htmlFor="name">Server</label>
                  <Select
                    options={ serverOptions }
                    onChange={ (option) => this.handleServerChange(option) }
                    value={ { label: selectedServer.label, value: selectedServer.value } }
                  />
                </div>

                <div className="row">
                  <Grid md={ 6 }>
                    <div className="form-group">
                      <label>Ip address</label>
                      <div>{ server.ip_address }</div>
                    </div>
                  </Grid>
                  <Grid md={ 6 }>
                    <div className="form-group">
                      <label>Port</label>
                      <div>{ server.port }</div>
                    </div>
                  </Grid>
                </div>

                <div className="row">
                  <Grid md={ 12 }>
                    <div className="form-group">
                      <label>Connect as</label>
                      <div>{ server.connect_as }</div>
                    </div>
                  </Grid>
                </div>

                <TextField
                  label="Project path"
                  id="project_path"
                  name="project_path"
                  onChange={ this.handleInputChange }
                  value={ input.project_path }
                />

                <Button
                  color="primary"
                  onClick={ this.handleSaveServerClick }
                >{ isUpdating ? 'Working...' : 'Update Server' }</Button>
              </PanelBody>
            </Panel>
          </Container>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    servers: state.servers,
  };
};

export default connect(
  mapStateToProps
)(ProjectServerEditPage);
