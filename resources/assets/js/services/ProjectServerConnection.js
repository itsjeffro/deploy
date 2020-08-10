import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectServerConnection extends BaseApi {
  get(project_id, server_id) {
    return this.getRequest('/api/projects/' + project_id + '/servers/' + server_id + '/test-connection');
  }
}

export default ProjectServerConnection;
