import '../bootstrap';
import { Deploy } from '../config';

export default class ProjectRedeployment {
    create(data) {
        return axios.request({
            method: 'POST',
            url: Deploy.path + '/api/redeployments',
            responseType: 'json',
            data: data
        });
    }
}