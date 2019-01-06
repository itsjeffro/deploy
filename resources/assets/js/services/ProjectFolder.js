import '../bootstrap';

export default class ProjectFolder {
    list(project_id) {
        return axios.request({
            method: 'GET',
            url: '/api/projects/' + project_id + '/folders',
            responseType: 'json'
        });
    }

    delete(project_id, folder_id) {
        return axios.request({
            method: 'POST',
            url: '/api/projects/' + project_id + '/folders/' + folder_id,
            data: {
                '_method' : 'DELETE'
            },
            responseType: 'json'
        });
    }

    create(project_id, data) {
        return axios.request({
            method: 'POST',
            url: '/api/projects/' + project_id + '/folders',
            data: data,
            responseType: 'json'
        });
    }
}