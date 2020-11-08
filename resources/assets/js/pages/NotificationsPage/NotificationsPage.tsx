import * as React from 'react';

import Panel from '../../components/Panel';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import NotificationsTable from './components/NotificationsTable';
import NotificationApi from '../../services/NotificationApi';
import NotificationModal from './components/NotificationModal';
import Pagination from '../../components/Pagination';
import PanelHeading from '../../components/PanelHeading';

class NotificationsPage extends React.Component<any, any> {
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
    isNotificationModalVisible: false,
    isFetching: true,
  };

  componentDidMount() {
    this.loadNotifications(1);
  }

  loadNotifications(page: number): void {
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
  
        this.setState({ isFetching: false, notifications: notifications });
      });
  }

  handleShowModalClick = (item: object): void => {
    this.setState({ 
      notification: item,
      isNotificationModalVisible: true,
    });
  };

  handleDismissModalClick = (): void => {
    this.setState({ isNotificationModalVisible: false });
  };

  handleMarkAsReadClick = (notificationId: number): void => {
    const notificationApi = new NotificationApi;

    notificationApi
      .markAsRead(notificationId)
      .then(response => {
        this.loadNotifications(1);
      });
  }

  handlePageChangeClick = (page: number): void => {
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
    const { notifications, notification, isNotificationModalVisible, isFetching } = this.state;

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
              <PanelHeading>
                <h5 className="panel-title">Notification List</h5>
              </PanelHeading>
              <NotificationsTable
                isLoading={ isFetching }
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
                onPageChangeClick={ this.handlePageChangeClick }
              />
            </div>
          </Container>

          <NotificationModal
            isVisible={ isNotificationModalVisible }
            onDismissModalClick={ this.handleDismissModalClick }
            notification={ notification }
          />
        </div>
      </Layout>
    )
  }
}

export default NotificationsPage;
