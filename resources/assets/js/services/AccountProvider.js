import '../bootstrap';

export default class AccountProvider {
    index(endpoint) {
        return axios.request({
            method: 'GET',
            url: endpoint,
            responseType: 'json'
        });
    }
}