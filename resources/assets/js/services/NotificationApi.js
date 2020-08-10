import '../bootstrap';
import BaseApi from './Api/BaseApi';

class NotificationApi extends BaseApi {
  /**
   * Returns the specified notification.
   * 
   * @param {number} notificationId
   */
  get(notificationId) {
    return this.getRequest(`/api/notifications/${notificationId}`);
  }

  /**
   * Returns a list of notifications.
   * 
   * @param {object} options
   */
  list(options) {
    const page = options.page || 1;

    return this.getRequest(`/api/notifications?page=${page}`);
  }

  /**
   * Mark the specified notification as read.
   *
   * @param {number} notificationId 
   */
  markAsRead(notificationId) {
    return this.postRequest(`/api/notifications/${notificationId}/read`);
  }
}

export default NotificationApi;
