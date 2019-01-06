import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectActionHook {
  create(project_id, action_id, data) {
    return axios.request({
      method: 'POST',
      url: Deploy.path + '/api/projects/' + project_id + '/actions/' + action_id + '/hooks',
      data: data,
      responseType: 'json'
    });
  }

  update(project_id, action_id, hook_id, data) {
    return axios.request({
      method: 'PUT',
      url: Deploy.path + '/api/projects/' + project_id + '/actions/' + action_id + '/hooks/' + hook_id,
      data: data,
      responseType: 'json'
    });
  }

  delete(project_id, action_id, hook_id) {
    return axios.request({
      method: 'POST',
      url: Deploy.path + '/api/projects/' + project_id + '/actions/' + action_id + '/hooks/' + hook_id,
      data: {
        '_method' : 'DELETE'
      },
      responseType: 'json'
    });
  }
}