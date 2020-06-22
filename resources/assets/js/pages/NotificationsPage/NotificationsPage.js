import React from 'react';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import NotificationsTable from './NotificationsTable';
import NotificationApi from '../../services/NotificationApi';

class NotificationsPage extends React.Component {
  state = {
    items: [],
  };

  componentDidMount() {
    const notificationApi = new NotificationApi;

    notificationApi
      .list()
      .then(response => {
        this.setState({ items: response.data.data });
      });
  }

  render() {
    const { items } = this.state;

    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <div className="pull-left heading">
              <h2>Notifications</h2>
            </div>
          </Container>

          <Container fluid>
            <Panel>
              <NotificationsTable
                items={ items }
              />
            </Panel>
          </Container>
        </div>
      </Layout>
    )
  }
}

export default NotificationsPage;
