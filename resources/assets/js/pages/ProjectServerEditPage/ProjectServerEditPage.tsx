import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'

import { createToast } from '../../state/alert/alertActions';
import {getServer, listServers} from "../../state/servers/actions";
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import ProjectHeading from "../../components/ProjectHeading";
import {fetchProject, updateProjectServer} from "../../state/project/actions";
import TextField from "../../components/TextField";
import PanelBody from "../../components/PanelBody";
import Grid from "../../components/Grid";

class ProjectServerEditPage extends React.Component<any, any> {
  state = {
    isFetching: true,
    isCreated: false,
    serverId: null,
    input: {
      name: '',
      ip_address: '',
      port: '',
      connect_as: '',
      project_path: '',
    },
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

    dispatch(getServer(server_id));

    dispatch(fetchProject(project_id));

    dispatch(listServers());
  }

  componentWillReceiveProps(nextProps: any) {
    const { dispatch, servers } = this.props;

    // Handler project server create
    if (nextProps.servers.isCreated !== servers.isCreated && nextProps.servers.isCreated) {
      dispatch(createToast('Server updated successfully.'));
      
      this.setState({ isCreated: true });
    }
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
    const { dispatch, project } = this.props;
    const { input } = this.state;

    dispatch(updateProjectServer(project.item.id, 0, input));
  };

  /**
   * Handle existing server option select change.
   */
  handleServerChange = (option): void => {
    let serverId = option ? option.value : null;

    this.setState((prevState) => {
      const input = {
        ...prevState.input,
        server_id: serverId,
      };

      return { input: input };
    });
  }

  /**
   * Render component.
   */
  render() {
    const { project, servers } = this.props;
    const { isCreated } = this.state;

    if (isCreated) {
      return <Redirect to={ `/projects/${ project.item.id }` } />
    }

    const serverOptions = servers.items.map((server: any) => ({
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
                <PanelTitle>Edit Server</PanelTitle>
              </PanelHeading>

              <PanelBody>
                { servers.errors.length ? <AlertErrorValidation errors={ servers.errors } /> : '' }

                <div className="form-group">
                  <label htmlFor="name">Server</label>
                  <Select
                    options={ serverOptions }
                    onChange={ (option) => this.handleServerChange(option) }
                    value={ { label: servers.item.name, value: servers.item.id } }
                  />
                </div>

                <div className="row">
                  <Grid md={ 6 }>
                    <div className="form-group">
                      <label>Ip address</label>
                      <div>{ servers.item.ip_address }</div>
                    </div>
                  </Grid>
                  <Grid md={ 6 }>
                    <div className="form-group">
                      <label>Port</label>
                      <div>{ servers.item.port }</div>
                    </div>
                  </Grid>
                </div>

                <div className="row">
                  <Grid md={ 12 }>
                    <div className="form-group">
                      <label>Connect as</label>
                      <div>{ servers.item.connect_as }</div>
                    </div>
                  </Grid>
                </div>

                <TextField
                  label="Project path"
                  id="project_path"
                  name="project_path"
                  onChange={ this.handleInputChange }
                  value={ servers.item.project_path }
                />

                <Button
                  color="primary"
                  onClick={ this.handleSaveServerClick }
                >{ servers.isCreating ? 'Working...' : 'Update Server' }</Button>
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
)(ProjectServerEditPage);
