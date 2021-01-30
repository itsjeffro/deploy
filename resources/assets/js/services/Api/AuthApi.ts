import '../../bootstrap';
import BaseApi from './BaseApi';

class AuthApi extends BaseApi {
  user() {
    return this.getRequest(`/api/auth/user`);
  }
}

export default AuthApi;
