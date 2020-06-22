import '../bootstrap';
import { Deploy } from '../config';

class NotificationApi {
  /**
   * Returns the specified notification.
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
   */
  list() {
    return axios.request({
      method: 'GET',
      url: `${Deploy.path}/api/notifications`,
      responseType: 'json'
    });
  }
}

export default NotificationApi;
