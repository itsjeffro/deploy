import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectKey {
    put(project_id) {
        return axios.request({
            method: 'PUT',
            url: Deploy.path + '/api/projects/' + project_id + '/key',
            responseType: 'json'
        });
    }
}