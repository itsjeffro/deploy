import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectServer {
    create(project_id, data) {
        return axios.request({
            method: 'POST',
            url: Deploy.path + '/api/projects/' + project_id + '/servers',
            responseType: 'json',
            data: data,
        });
    }

    get(project_id, server_id) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/projects/' + project_id + '/servers/' + server_id,
            responseType: 'json'
        });
    }
    
    put(project_id, server_id, data) {
        return axios.request({
            method: 'PUT',
            url: Deploy.path + '/api/projects/' + project_id + '/servers/' + server_id,
            responseType: 'json',
            data: data
        });
    }

    delete(project_id, server_id) {
        return axios.request({
            method: 'POST',
            url: Deploy.path + '/api/projects/' + project_id + '/servers/' + server_id,
            data: {
                '_method' : 'DELETE'
            },
            responseType: 'json'
        });
    }
}