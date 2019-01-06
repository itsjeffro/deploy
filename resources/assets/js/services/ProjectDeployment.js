import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectDeployment {
    index(project_id) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/projects/' + project_id + '/deployments',
            responseType: 'json'
        });
    }

    get(project_id, deployment_id) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/projects/' + project_id + '/deployments/' + deployment_id,
            responseType: 'json'
        });
    }
    
    create(project_id, data) {
        return axios.request({
            method: 'POST',
            url: Deploy.path + '/api/projects/' + project_id + '/deployments',
            responseType: 'json',
            data: data
        });
    }
}