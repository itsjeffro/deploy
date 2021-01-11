import '../../bootstrap';
import BaseApi from './BaseApi';

class ServerTestConnectionApi extends BaseApi {
  get(project_id, server_id) {
    return this.getRequest('/api/servers/' + server_id + '/test-connection');
  }
}

export default ServerTestConnectionApi;
