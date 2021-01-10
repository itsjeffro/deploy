import React from 'react';
import { connect } from 'react-redux';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ServersTable from './components/ServersTable';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import ServerApi from '../../services/Api/ServerApi';
import ServerKeyModal from '../../components/ServerKeyModal';
import RemoveServerModal from './components/RemoveServerModal';
import CreateServerModal from './components/CreateServerModal';
import PanelHeading from "../../components/PanelHeading";

class ServersPage extends React.Component {
  state = {
    servers: {
      items: [],
    },
    server: {},
    isCreateServerModalVisible: false,
    isServerKeyModalVisible: false,
    isRemoveServerModalVisible: false,
  };

  componentDidMount() {
    const serverApi = new ServerApi();

    serverApi.list({})
      .then(response => {
        let servers = {
          items: response.data.data,
        };

        this.setState({ servers: servers });
      });
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
    //
  };
  
  handleShowCreateServerModalClick = () => {
    this.setState({ isCreateServerModalVisible: true });
  };

  handleHideCreateServerModalClick = () => {
    this.setState({ isCreateServerModalVisible: false });
  };

  render() {
    const {
      servers,
      server,
      isServerKeyModalVisible,
      isRemoveServerModalVisible,
      isCreateServerModalVisible,
    } = this.state;

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
                servers={ servers.items }
                onServerConnectionTestClick={ this.handleServerConnectionTestClick }
                onServerRemoveClick={ this.handleServerDeleteModal }
                onServerKeyClick={ this.handleServerKeyModal }
              />
            </Panel>
          </Container>

          <RemoveServerModal
            isVisible={ isRemoveServerModalVisible }
            onModalHide={ this.handleHideServerDeleteModal }
            onRemoveServerClick={ this.handleDeleteServerClick }
          />

          <CreateServerModal
            isVisible={ isCreateServerModalVisible }
            onCreateServerClick={ this.handleHideCreateServerModalClick }
            onHideModalClick={ this.handleHideCreateServerModalClick }
            onInputChange={ this.handleHideCreateServerModalClick }
            server={ server }
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

const mapStateToProps = state => {
  return {
    servers: state.servers || [],
  };
};

export default connect(mapStateToProps)(ServersPage);
