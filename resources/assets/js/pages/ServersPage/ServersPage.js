import React from 'react';
import { connect } from 'react-redux';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ServersTable from './components/ServersTable';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import ServerApi from '../../services/Api/ServerApi';

class ServersPage extends React.Component {
  state = {
    servers: {
      items: [],
    },
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
  }

  handleServerRemoveModal = () => {
    //
  }

  handleServerKeyModal = () => {
    //
  }

  handleShowModalClick = () => {
    //
  }

  handleHideModalClick = () => {
    //
  }

  render() {
    const { servers } = this.state;

    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <div className="pull-left heading">
              <h2>Servers List</h2>
            </div>
            <div className="pull-right">
              <Button color="primary" onClick={ this.handleShowModalClick }>
                <Icon iconName="plus" /> Add Server
              </Button>
            </div>
          </Container>

          <Container fluid>
            <Panel>
              <ServersTable
                servers={ servers.items }
                onServerConnectionTestClick={ this.handleServerConnectionTestClick }
                onServerRemoveClick={ this.handleServerRemoveModal }
                onServerKeyClick={ this.handleServerKeyModal }
              />
            </Panel>
          </Container>
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
