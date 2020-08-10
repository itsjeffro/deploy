import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectEnvironmentApi extends BaseApi {
  /**
   * Update project environment.
   */
  put(project_id, data) {
    return this.putRequest(`/api/projects/${project_id}/environment`, data);
  }
}

export default ProjectEnvironmentApi;
