import '../bootstrap';

export default class Project {
    get(project_id) {
        return axios.request({
            method: 'GET',
            url: '/api/projects/' + project_id,
            responseType: 'json'
        });
    }

    post(data) {
        return axios.request({
            method: 'POST',
            url: '/api/projects',
            data: data,
            responseType: 'json'
        });
    }

    index() {
        return axios.request({
            method: 'GET',
            url: '/api/projects',
            responseType: 'json'
        });
    }
    
    update(project_id, data) {
        return axios.request({
            method: 'PUT',
            url: '/api/projects/' + project_id,
            data: data,
            responseType: 'json'
        });
    }
    
    delete(project_id) {
        return axios.request({
            method: 'DELETE',
            url: '/api/projects/' + project_id,
            responseType: 'json'
        });
    }
}