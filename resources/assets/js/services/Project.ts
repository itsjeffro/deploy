import '../bootstrap';
import BaseApi from './Api/BaseApi';

export default class Project extends BaseApi {
  get(project_id) {
    return this.getRequest('/api/projects/' + project_id);
  }

  post(data) {
    return this.postRequest('/api/projects', data);
  }

  index() {
    return this.getRequest('/api/projects');
  }
  
  update(project_id, data) {
    return this.putRequest('/api/projects/' + project_id, data);
  }
  
  delete(project_id) {
    return this.deleteRequest('/api/projects/' + project_id);
  }
}