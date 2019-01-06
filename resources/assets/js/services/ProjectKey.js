import '../bootstrap';

export default class ProjectKey {
    put(project_id) {
        return axios.request({
            method: 'PUT',
            url: '/api/projects/' + project_id + '/key',
            responseType: 'json'
        });
    }
}