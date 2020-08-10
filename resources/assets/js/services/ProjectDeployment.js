import '../bootstrap';
import BaseApi from './Api/BaseApi';

export default class ProjectDeployment extends BaseApi {
  index(project_id) {
    return this.getRequest(`/api/projects/${project_id}/deployments`);
  }

  get(project_id, deployment_id) {
    return this.getRequest(`/api/projects/${project_id}/deployments/${deployment_id}`);
  }
  
  create(project_id, data) {
    return this.postRequest(`/api/projects/${project_id}/deployments`, data);
  }
}
