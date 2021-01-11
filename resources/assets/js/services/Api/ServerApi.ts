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
  
  /**
   * Get server by id.
   */
  get(serverId: number): any {
    return this.getRequest(`/api/servers/${ serverId }`);
  }
  
  /**
   * Update server by id.
   */
  update(serverId: number, data: any): any {
    return this.putRequest(`/api/servers/${ serverId }`, data);
  }
  
  /**
   * Delete server by id.
   */
  delete(serverId: number): any {
    return this.deleteRequest(`/api/servers/${ serverId }`);
  }
  
  /**
   * Create server.
   */
  create(data: object): any {
    return this.deleteRequest(`/api/servers`);
  }
}

export default ServerApi;
