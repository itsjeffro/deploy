import '../bootstrap';
import BaseApi from './Api/BaseApi';

class ProjectRedeployment extends BaseApi {
  create(data) {
    return this.postRequest('/api/redeployments', data);
  }
}

export default ProjectRedeployment;
