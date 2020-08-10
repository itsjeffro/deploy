import '../bootstrap';
import BaseApi from './Api/BaseApi';

class EnvironmentResetApi extends BaseApi {
  /**
   * Resets project environment.
   */
  update(project_id, data) {
    return this.putRequest(`/api/projects/${project_id}/environment-reset`, data);
  }
}

export default EnvironmentResetApi;
