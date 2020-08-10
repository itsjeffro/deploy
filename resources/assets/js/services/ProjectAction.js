import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectAction extends BaseApi {
  index(project_id) {
    return this.getRequest('/api/projects/' + project_id + '/actions');
  }

  get(project_id, action_id) {
    return this.getRequest('/api/projects/' + project_id + '/actions/' + action_id);
  }
}

export default ProjectAction;
