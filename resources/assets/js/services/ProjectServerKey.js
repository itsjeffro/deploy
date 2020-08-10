import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectServerKey extends BaseApi {
  get(project_id, server_id) {
    return this.getRequest('/api/projects/' + project_id + '/servers/' + server_id + '/public_key');
  }
}

export default ProjectServerKey;
