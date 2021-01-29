import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import { createServer } from "../../state/servers/actions";
import AlertErrorValidation from '../../components/AlertErrorValidation';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';

class ServerCreatePage extends React.Component<any, any> {
  state = {
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

  componentWillReceiveProps(nextProps: any) {
    const { dispatch, servers } = this.props;

    // Handler project server create
    if (nextProps.servers.isCreated !== servers.isCreated && nextProps.servers.isCreated) {
      dispatch(createToast('Server created successfully.'));
      
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
  handleClick = (): void => {
    const { dispatch } = this.props;
    const { server } = this.state;

    dispatch(createServer(server));
  };

  render() {
    const { servers } = this.props;
    const { isCreated } = this.state;

    if (isCreated) {
      return <Redirect to={ `/servers` } />
    }

    return (
      <Layout>
        <div className="content">
          <div className="container-fluid heading">
            <h2>Create server</h2>
          </div>

          <Container fluid>
            <Panel>
              <PanelHeading>
                <PanelTitle>Create Server</PanelTitle>
              </PanelHeading>

              <div className="panel-body">
                { servers.errors.length ? <AlertErrorValidation errors={ servers.errors } /> : '' }

                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    className="form-control"
                    name="name"
                    type="text"
                    id="name"
                    onChange={this.handleInputChange}
                    value={this.state.server.name}
                  />
                </div>
                <div className="row">
                  <div className="form-group col-xs-8 col-md-9">
                    <label htmlFor="ip_address">Ip Address</label>
                    <input
                      className="form-control"
                      name="ip_address"
                      type="text"
                      id="ip_address"
                      onChange={this.handleInputChange}
                      value={this.state.server.ip_address}
                    />
                  </div>
                  <div className="form-group col-xs-4 col-md-3">
                    <label htmlFor="port">Port</label>
                    <input
                      className="form-control"
                      name="port"
                      type="text"
                      id="port"
                      onChange={this.handleInputChange}
                      value={this.state.server.port}
                      placeholder="22"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="connect_as">Connect As</label>
                  <input
                    className="form-control"
                    name="connect_as"
                    type="text"
                    id="connect_as"
                    onChange={this.handleInputChange}
                    value={this.state.server.connect_as}
                  />
                </div>

                <Button color="primary" onClick={ this.handleClick }>{ servers.isCreating ? 'Working...' : 'Save Server' }</Button>
              </div>
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
)(ServerCreatePage);
