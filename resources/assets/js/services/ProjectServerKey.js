import '../bootstrap';

export default class ProjectServerKey {
    get(project_id, server_id) {
        return axios.request({
            method: 'GET',
            url: '/api/projects/' + project_id + '/servers/' + server_id + '/public_key',
            responseType: 'json'
        });
    }
}