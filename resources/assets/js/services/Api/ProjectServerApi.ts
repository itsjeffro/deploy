import '../../bootstrap';
import BaseApi from './BaseApi';

class ProjectServerApi extends BaseApi {
  create(projectId, data) {
    return this.postRequest('/api/projects/' + projectId + '/servers', data);
  }

  get(projectId, serverId) {
    return this.getRequest(`/api/projects/${ projectId }/servers/${ serverId }`);
  }

  update(projectId, serverId, data) {
    return this.putRequest(`/api/projects/${ projectId }/servers/${ serverId }`, data);
  }

  delete(projectId, serverId) {
    return this.deleteRequest(`/api/projects/${ projectId }/servers/${ serverId }`);
  }
}

export default ProjectServerApi;
