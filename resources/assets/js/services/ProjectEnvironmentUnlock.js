import '../bootstrap';

export default class ProjectEnvironmentUnlock {
    post(project_id, data) {
        return axios.request({
            method: 'POST',
            url: '/api/projects/' + project_id + '/environment-unlock',
            data: data,
            responseType: 'json'
        });
    }
}