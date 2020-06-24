import React from 'react';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import NotificationsTable from './NotificationsTable';
import NotificationApi from '../../services/NotificationApi';
import NotificationDialog from './NotificationDialog';
import Pagination from '../../components/Pagination';

class NotificationsPage extends React.Component {
  state = {
    notification: {},
    notifications: {
      items: [],
      currentPage: 1,
      perPage: 1,
      totalItems: 0,
      from: 0,
      to: 0,
    },
  };

  componentDidMount() {
    this.loadNotifications(1);
  }

  loadNotifications(page) {
    const notificationApi = new NotificationApi;

    notificationApi
      .list({ page: page })
      .then(response => {
        let notifications = {
          items: response.data.data,
          currentPage: response.data.meta.current_page,
          perPage: response.data.meta.per_page,
          totalItems: response.data.meta.total,
          from: response.data.meta.from,
          to: response.data.meta.to,
        }
  
        this.setState({ notifications: notifications });
      });
  }

  handleShowModalClick = (item) => {
    this.setState({ notification: item });

    $('#notification-modal').modal('show');
  };

  handleDismissModalClick = () => {
    $('#notification-modal').modal('hide');
  };

  handleMarkAsReadClick = (notificationId) => {
    const notificationApi = new NotificationApi;

    notificationApi
      .markAsRead(notificationId)
      .then(response => {
        this.loadNotifications(1);
      });
  }

  handlePageChangeClick = (page) => {
    const { notifications } = this.state;

    let total = notifications.totalItems;
    let perPage = notifications.perPage;
    let totalPages = Math.ceil(total / perPage);
  
    if (page < 1 || page > totalPages) {
      return;
    }

    this.loadNotifications(page);
  }

  render() {
    const { notifications, notification } = this.state;

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
                onShowModalClick={ this.handleShowModalClick }
                onMarkAsReadClick={ this.handleMarkAsReadClick }
                items={ notifications.items }
              />
            </Panel>

            <div className="mb-1">
              <div className="pull-right table-meta">
                { notifications.from } of { notifications.to } of { notifications.totalItems }
              </div>

              <Pagination
                total={ notifications.totalItems }
                perPage={ notifications.perPage }
                currentPage={ notifications.currentPage }
                perPage={ notifications.perPage }
                onPageChangeClick={ this.handlePageChangeClick }
              />
            </div>
          </Container>

          <NotificationDialog 
            notification={ notification }
            onDismissModalClick={ this.handleDismissModalClick }
          />
        </div>
      </Layout>
    )
  }
}

export default NotificationsPage;
