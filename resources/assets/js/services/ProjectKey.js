import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectKey extends BaseApi {
  put(project_id) {
    return this.putRequest(`/api/projects/${project_id}/key`);
  }
}

export default ProjectKey;
