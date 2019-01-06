import '../bootstrap';
import { Deploy } from '../config';

export default class EnvironmentResetApi {
    update(project_id, data) {
        return axios.request({
            method: 'PUT',
            url: Deploy.path + '/api/projects/' + project_id + '/environment-reset',
            data: data,
            responseType: 'json'
        });
    }
}