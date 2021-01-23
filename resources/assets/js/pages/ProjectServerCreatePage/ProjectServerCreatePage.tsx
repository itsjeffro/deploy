import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'

import { createToast } from '../../state/alert/alertActions';
import { createServer, listServers } from "../../state/servers/actions";
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import Grid from "../../components/Grid";
import ProjectHeading from "../../components/ProjectHeading";
import {createProjectServer, fetchProject} from "../../state/project/actions";
import Radio from "../../components/Radio";
import TextField from "../../components/TextField";
import PanelBody from "../../components/PanelBody";

class ProjectServerCreatePage extends React.Component<any, any> {
  state = {
    selectedServerOption: 'new-server',
    isFetching: true,
    isCreated: false,
    server: {
      name: '',
      port: '',
      ip_address: '',
      project_path: '',
      connect_as: '',
    },
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: {
          project_id,
        },
      },
    } = this.props;

    dispatch(fetchProject(project_id));

    dispatch(listServers());
  }

  componentWillReceiveProps(nextProps: any) {
    const { dispatch, servers } = this.props;

    // Handler project server create
    if (nextProps.servers.isCreated !== servers.isCreated && nextProps.servers.isCreated) {
      const isNewServer = this.state.selectedServerOption;

      dispatch(createToast(isNewServer ? 'Server created successfully.' : 'Existing server added successfully.'));
      
      this.setState({ isCreated: true });
    }
  }

  /**
   * Handle input change when creating a server.
   */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState((state: any) => {
      const server = {
        ...state.server,
        [name]: value
      };

      return { server: server };
    });
  };

  /**
   * Handle click for creating a server.
   */
  handleSaveServerClick = (): void => {
    const { dispatch } = this.props;
    const { server } = this.state;

    dispatch(createServer(server));
  };

  /**
   * handle changing selected server option.
   */
  handleServerOptionChange = (event: any, value: string): void => {
    this.setState({ selectedServerOption: value });
  }

  /**
   * Render component.
   */
  render() {
    const { project, servers } = this.props;
    const { isCreated, selectedServerOption } = this.state;

    if (isCreated) {
      return <Redirect to={ `/servers` } />
    }

    const serverOptions = servers.items.map((server) => ({
      label: server.name,
      value: server.id,
    }));

    return (
      <Layout>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            <Panel>
              <PanelHeading>
                <PanelTitle>Create Server</PanelTitle>
              </PanelHeading>

              <PanelBody>
                { servers.errors.length ? <AlertErrorValidation errors={ servers.errors } /> : '' }

                <label>Server options</label>

                <div className="row">
                  <Grid md={ 6 }>
                    <Radio
                      variant="tile"
                      label="Create a new server and SSH key"
                      value="new-server"
                      name="server_options"
                      isChecked={ this.state.selectedServerOption === 'new-server' }
                      onChange={ this.handleServerOptionChange }
                    />
                  </Grid>

                  <Grid md={ 6 }>
                    <Radio
                      variant="tile"
                      label="Use an existing server and SSH key"
                      value="existing-server"
                      name="server_options"
                      isChecked={ this.state.selectedServerOption === 'existing-server' }
                      onChange={ this.handleServerOptionChange }
                    />
                  </Grid>
                </div>

                { selectedServerOption !== 'new-server'
                  ? <div className="form-group">
                    <label htmlFor="name">Server</label>
                    <Select
                      options={ serverOptions }
                      onChange={ (value) => console.log(value) }
                      isClearable
                    />
                  </div> : '' }

                { selectedServerOption === 'new-server'
                  ? <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      id="name"
                      onChange={this.handleInputChange}
                      value={this.state.server.name}
                    />
                  </div> : '' }

                { selectedServerOption === 'new-server'
                  ? <div className="row">
                    <Grid xs={ 8 } md={ 9 }>
                      <TextField
                        label="IP address"
                        id="ip_address"
                        name="ip_address"
                        onChange={ this.handleInputChange }
                        value={ this.state.server.ip_address }
                      />
                    </Grid>
                    <Grid xs={ 4 } md={ 3 }>
                      <TextField
                        label="Port"
                        id="port"
                        name="port"
                        onChange={ this.handleInputChange }
                        value={ this.state.server.port }
                      />
                    </Grid>
                  </div> : '' }

                { selectedServerOption === 'new-server'
                  ? <TextField
                    label="Connect as"
                    id="connect_as"
                    name="connect_as"
                    onChange={ this.handleInputChange }
                    value={ this.state.server.connect_as }
                  /> : '' }

                <TextField
                  label="Project path"
                  id="project_path"
                  name="project_path"
                  onChange={ this.handleInputChange }
                  value={ this.state.server.project_path }
                />

                <Button
                  color="primary"
                  onClick={ this.handleSaveServerClick }
                >{ servers.isCreating ? 'Working...' : 'Save Server' }</Button>
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
    project: state.project,
    servers: state.servers,
  };
};

export default connect(
  mapStateToProps
)(ProjectServerCreatePage);
