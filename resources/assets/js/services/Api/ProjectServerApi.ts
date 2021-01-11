import '../../bootstrap';
import BaseApi from './BaseApi';

class ProjectServerApi extends BaseApi {
  create(project_id, data) {
    return this.postRequest('/api/projects/' + project_id + '/servers', data);
  }

  delete(project_id, server_id) {
    return this.deleteRequest('/api/projects/' + project_id + '/servers/' + server_id);
  }
}

export default ProjectServerApi;
