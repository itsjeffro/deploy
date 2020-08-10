import '../bootstrap';
import BaseApi from './Api/BaseApi';

class AccountProvider extends BaseApi {
  /**
   * List authenticated git providers.
   */
  index(endpoint) {
    return this.getRequest(endpoint);
  }
}

export default AccountProvider