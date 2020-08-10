import '../bootstrap';
import BaseApi from './Api/BaseApi';

class RepositoryTagBranch extends BaseApi {
  /**
   * Returns a list of tags and branches associated with the git repository.
   */
  get(provider_id, repository) {
    return this.getRequest(`/api/repositories/branches-tags?provider_id=${provider_id}&repository=${repository}`);
  }
}

export default RepositoryTagBranch;
