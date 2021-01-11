import '../../bootstrap';
import BaseApi from './Api/BaseApi';

class ServerConnectionApi extends BaseApi {
  get(project_id, server_id) {
    return this.getRequest('/api/servers/' + server_id + '/test-connection');
  }
}

export default ServerConnectionApi;
