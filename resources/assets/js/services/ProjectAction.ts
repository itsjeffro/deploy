import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectAction extends BaseApi {
  index(project_id: string) {
    return this.getRequest('/api/projects/' + project_id + '/actions');
  }

  get(project_id: string, action_id: string) {
    return this.getRequest('/api/projects/' + project_id + '/actions/' + action_id);
  }

  updateHookOrder(project_id: string, action_id: string, data: object) {
    return this.putRequest('/api/projects/' + project_id + '/actions/' + action_id + '/hook-order', data);
  }
}

export default ProjectAction;
