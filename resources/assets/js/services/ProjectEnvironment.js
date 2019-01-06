import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectEnvironmentApi {
    put(project_id, data) {
        return axios.request({
            method: 'PUT',
            url: Deploy.path + '/api/projects/' + project_id + '/environment',
            data: data,
            responseType: 'json'
        });
    }
}