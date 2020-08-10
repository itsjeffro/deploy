import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectActionHook extends BaseApi {
  create(project_id, action_id, data) {
    return this.postRequest(`/api/projects/${project_id}'/actions/${action_id}/hooks`, data);
  }

  update(project_id, action_id, hook_id, data) {
    return this.putRequest(`/api/projects/${project_id}/actions/${action_id}/hooks/${hook_id}`, data);
  }

  delete(project_id, action_id, hook_id) {
    return this.deleteRequest(`/api/projects/${project_id}/actions/${action_id}/hooks/${hook_id}`);
  }
}

export default ProjectActionHook;
