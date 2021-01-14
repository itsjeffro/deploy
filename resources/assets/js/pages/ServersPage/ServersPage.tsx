import * as React from 'react';
import { connect } from 'react-redux';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ServersTable from './components/ServersTable';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import ServerKeyModal from '../../components/ServerKeyModal';
import RemoveServerModal from './components/RemoveServerModal';
import CreateServerModal from './components/CreateServerModal';
import PanelHeading from "../../components/PanelHeading";
import {createServer, deleteServer, listServers} from "../../state/servers/actions";
import {createProjectServer} from "../../state/project/actions";

class ServersPage extends React.Component<any, any> {
  state = {
    server: {
      id: 0,
    },
    input: {},
    isCreateServerModalVisible: false,
    isServerKeyModalVisible: false,
    isRemoveServerModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(listServers());
  }

  handleServerConnectionTestClick = () => {
    //
  };

  handleServerKeyModal = (server) => {
    this.setState({
      isServerKeyModalVisible: true,
      server: server,
    });
  };

  handleHideServerKeyModal = () => {
    this.setState({ isServerKeyModalVisible: false });
  };

  handleServerDeleteModal = (server) => {
    this.setState({
      isRemoveServerModalVisible: true,
      server: server,
    });
  };

  handleHideServerDeleteModal = () => {
    this.setState({ isRemoveServerModalVisible: false });
  };

  handleDeleteServerClick = () => {
    const { dispatch } = this.props;
    const { server } = this.state;

    dispatch(deleteServer(server.id));
  };

  handleShowCreateServerModalClick = () => {
    this.setState({ isCreateServerModalVisible: true });
  };

  handleHideCreateServerModalClick = () => {
    this.setState({ isCreateServerModalVisible: false });
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

  render() {
    const {
      isServerKeyModalVisible,
      isRemoveServerModalVisible,
      isCreateServerModalVisible,
      input,
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
              <Button color="primary" onClick={ this.handleShowCreateServerModalClick }>
                <Icon iconName="plus" /> Add Server
              </Button>
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

          <CreateServerModal
            isVisible={ isCreateServerModalVisible }
            onHideModalClick={ this.handleHideCreateServerModalClick }
            onInputChange={ this.handleInputChange }
            onCreateServerClick={ this.handleCreateServerClick }
            input={ input }
            isCreating={ servers.isCreating }
            errors={ servers.errors }
          />

          <ServerKeyModal
            isVisible={ isServerKeyModalVisible }
            onModalHide={ this.handleHideServerKeyModal }
            server={ {} }
          />
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    servers: state.servers,
  };
};

export default connect(mapStateToProps)(ServersPage);
