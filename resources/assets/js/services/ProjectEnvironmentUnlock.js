import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectEnvironmentUnlock {
    post(project_id, data) {
        return axios.request({
            method: 'POST',
            url: Deploy.path + '/api/projects/' + project_id + '/environment-unlock',
            data: data,
            responseType: 'json'
        });
    }
}