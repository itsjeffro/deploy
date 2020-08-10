import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectEnvironmentUnlock extends BaseApi {
  /**
   * Unlocks project environment.
   */
  post(project_id, data) {
    return this.postRequest(`/api/projects/${project_id}/environment-unlock`, data);
  }
}

export default ProjectEnvironmentUnlock;
