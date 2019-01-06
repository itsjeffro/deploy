import '../bootstrap';
import { Deploy } from '../config';

class RepositoryTagBranch {
    get(provider_id, repository) {
        return axios.request({
            method: 'GET',
            url: Deploy.path + '/api/repositories/branches-tags?provider_id=' + provider_id + '&repository=' + repository,
            responseType: 'json'
        });
    }
}

export default RepositoryTagBranch;