import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";

import ServerKeyModal from '../../components/ServerKeyModal';
import Layout from "../../components/Layout";
import Panel from '../../components/Panel';
import Container from "../../components/Container";
import ServersTable from './components/ServersTable';
import Icon from '../../components/Icon';
import RemoveServerModal from './components/RemoveServerModal';
import PanelHeading from "../../components/PanelHeading";
import { createServer, deleteServer, listServers, testServerConnection } from "../../state/servers/actions";
import { createToast } from "../../state/alert/alertActions";
import { fetchMe } from "../../state/auth/authActions";
import { updateServerConnection } from "../../state/servers/actions/updateServerConnection";

class ServersPage extends React.Component<any, any> {
  state = {
    server: {
      id: 0,
    },
    input: {},
    isAddServerModalVisible: false,
    isServerKeyModalVisible: false,
    isRemoveServerModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(listServers());

    dispatch(fetchMe());
  }

  /**
   * Update state when component props update.
   */
  componentWillReceiveProps(nextProps: any): void {
    const { servers, dispatch, auth } = this.props;

    if (nextProps.servers.isCreated !== servers.isCreated && nextProps.servers.isCreated) {
      this.setState({ isCreateServerModalVisible: false, input: {} });

      dispatch(createToast('Server created successfully.'));

      dispatch(listServers());
    }

    if (nextProps.servers.isDeleted !== servers.isDeleted && nextProps.servers.isDeleted) {
      dispatch(createToast('Server deleted successfully.'));

      this.setState({ isRemoveServerModalVisible: false });
    }

    if (nextProps.auth.user !== auth.user && nextProps.auth.user) {
      const user = nextProps.auth.user;

      this.listenForEvents(user.id);
    }
  }

  /**
   * Listen for Echo related events.
   */
  listenForEvents = (userId: number): void => {
    const { dispatch } = this.props;
    const echoWindow: any = window;
    const Echo = echoWindow.Echo;

    if (Echo !== null) {
      Echo
        .private(`user.${ userId }`)
        .listen('.Deploy\\Events\\ServerConnectionTested', e => {
          dispatch(updateServerConnection(e.server.id, e.server.connection_status));
        });
    }
  }

  /**
   * Process server connection test.
   */
  handleServerConnectionTestClick = (event, serverId) => {
    const { dispatch } = this.props;

    dispatch(testServerConnection(serverId));
  };

  /**
   * Display serve key modal.
   */
  handleServerKeyModal = (server): void => {
    this.setState({
      isServerKeyModalVisible: true,
      server: server,
    });
  };

  /**
   * Hide server key modal.
   */
  handleHideServerKeyModal = (): void => {
    this.setState({ isServerKeyModalVisible: false });
  };

  /**
   * Show "delete server" modal.
   */
  handleServerDeleteModal = (server): void => {
    this.setState({
      isRemoveServerModalVisible: true,
      server: server,
    });
  };

  /**
   * Hide "delete server" modal.
   */
  handleHideServerDeleteModal = (): void => {
    this.setState({ isRemoveServerModalVisible: false });
  };

  /**
   * Delete server on click.
   */
  handleDeleteServerClick = (): void => {
    const { dispatch } = this.props;
    const { server } = this.state;

    dispatch(deleteServer(server.id));
  };

  /**
   * Handle input change when creating a server.
   */
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState((state: any) => {
      const server = {
        ...state.input,
        [name]: value
      };

      return { input: server };
    });
  };

  /**
   * Handle click for creating a server.
   */
  handleCreateServerClick = (): void => {
    const { dispatch } = this.props;
    const { input } = this.state;

    dispatch(createServer(input));
  };

  /**
   * Render component.
   */
  render() {
    const {
      isServerKeyModalVisible,
      isRemoveServerModalVisible,
      server,
    } = this.state;

    const { servers } = this.props;

    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <div className="pull-left heading">
              <h2>Servers</h2>
            </div>
            <div className="pull-right">
              <NavLink className="btn btn-primary" to="/servers/create">
                <Icon iconName="plus" /> Create Server
              </NavLink>
            </div>
          </Container>

          <Container fluid>
            <Panel>
              <PanelHeading>
                <h5 className="panel-title">Server List</h5>
              </PanelHeading>
              <ServersTable
                isLoading={ servers.isFetching }
                servers={ servers.items || [] }
                onServerConnectionTestClick={ this.handleServerConnectionTestClick }
                onServerRemoveClick={ this.handleServerDeleteModal }
                onServerKeyClick={ this.handleServerKeyModal }
              />
            </Panel>
          </Container>

          <RemoveServerModal
            isVisible={ isRemoveServerModalVisible }
            isDeleting={ servers.isDeleting }
            onModalHide={ this.handleHideServerDeleteModal }
            onRemoveServerClick={ this.handleDeleteServerClick }
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

const mapStateToProps = (state) => {
  return {
    servers: state.servers,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ServersPage);
