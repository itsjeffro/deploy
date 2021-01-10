import '../../bootstrap';
import BaseApi from './BaseApi';

class ServerApi extends BaseApi {
  /**
   * Returns a list of servers.
   */
  list(options) {
    const page = options.page || 1;

    return this.getRequest(`/api/servers?page=${page}`);
  }
}

export default ServerApi;
