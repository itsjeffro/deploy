import '../../bootstrap';
import BaseApi from './BaseApi';

class ServerTestConnectionApi extends BaseApi {
  get(server_id: number) {
    return this.getRequest(`/api/servers/${ server_id }/test-connection`);
  }
}

export default ServerTestConnectionApi;
