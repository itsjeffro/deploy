import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectServerKey {
    get(project_id, server_id) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/projects/' + project_id + '/servers/' + server_id + '/public_key',
            responseType: 'json'
        });
    }
}