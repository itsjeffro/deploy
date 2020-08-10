import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectServer extends BaseApi {
  create(project_id, data) {
    return this.postRequest('/api/projects/' + project_id + '/servers', data);
  }

  get(project_id, server_id) {
    return this.getRequest('/api/projects/' + project_id + '/servers/' + server_id);
  }
  
  put(project_id, server_id, data) {
    return this.putRequest('/api/projects/' + project_id + '/servers/' + server_id, data);
  }

  delete(project_id, server_id) {
    return this.deleteRequest('/api/projects/' + project_id + '/servers/' + server_id);
  }
}

export default ProjectServer;
