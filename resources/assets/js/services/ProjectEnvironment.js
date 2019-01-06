import '../bootstrap';

export default class ProjectEnvironmentApi {
    put(project_id, data) {
        return axios.request({
            method: 'PUT',
            url: '/api/projects/' + project_id + '/environment',
            data: data,
            responseType: 'json'
        });
    }
}