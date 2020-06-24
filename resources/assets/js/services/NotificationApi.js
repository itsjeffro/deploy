import '../bootstrap';
import { Deploy } from '../config';

class NotificationApi {
  /**
   * Returns the specified notification.
   * 
   * @param {number} notificationId
   */
  get(notificationId) {
    return axios.request({
      method: 'GET',
      url: `${Deploy.path}/api/notifications/${notificationId}`,
      responseType: 'json'
    });
  }

  /**
   * Returns a list of notifications.
   * 
   * @param {object} options
   */
  list(options) {
    const page = options.page || 1;

    return axios.request({
      method: 'GET',
      url: `${Deploy.path}/api/notifications?page=${page}`,
      responseType: 'json'
    });
  }

  /**
   * Mark the specified notification as read.
   *
   * @param {number} notificationId 
   */
  markAsRead(notificationId) {
    return axios.request({
      method: 'POST',
      url: `${Deploy.path}/api/notifications/${notificationId}/read`,
      responseType: 'json'
    });
  }
}

export default NotificationApi;
