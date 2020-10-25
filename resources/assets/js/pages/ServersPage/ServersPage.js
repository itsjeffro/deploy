import React from 'react';
import { connect } from 'react-redux';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import ServersTable from './components/ServersTable';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

class ServersPage extends React.Component {

  componentDidMount() {
    //
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

  render() {
    const { servers } = this.props;

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
                servers={ servers }
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
