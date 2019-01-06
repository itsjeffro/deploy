import '../bootstrap';
import { Deploy } from '../config';

export default class AccountProvider {
    index(endpoint) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + endpoint,
            responseType: 'json'
        });
    }
}