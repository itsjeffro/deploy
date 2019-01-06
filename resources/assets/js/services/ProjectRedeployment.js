import '../bootstrap';

export default class ProjectRedeployment {
    create(data) {
        return axios.request({
            method: 'POST',
            url: '/api/redeployments',
            responseType: 'json',
            data: data
        });
    }
}