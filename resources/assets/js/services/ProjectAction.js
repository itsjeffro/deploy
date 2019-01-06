import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectAction {
    index(project_id) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/projects/' + project_id + '/actions',
            responseType: 'json'
        });
    }

    get(project_id, action_id) {
        return axios.request({
            method: 'GET',
            url: '/api/projects/' + project_id + '/actions/' + action_id,
            responseType: 'json'
        });
    }
}