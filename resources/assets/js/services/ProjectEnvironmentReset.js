import '../bootstrap';

export default class EnvironmentResetApi {
    update(project_id, data) {
        return axios.request({
            method: 'PUT',
            url: '/api/projects/' + project_id + '/environment-reset',
            data: data,
            responseType: 'json'
        });
    }
}