import { Deploy } from '../../config';

class BaseApi {
  _getEndpoint(endpoint) {
    let apiEndpoint = endpoint.replace(/\/+/, "");
    let path = Deploy.path.replace(/\/+$/, "");

    if (path !== "") {
      path = "/" + Deploy.path;
    }

    return Deploy.url + path + "/" + apiEndpoint;
  }

  getRequest(endpoint) {
    return axios.request({
      method: 'GET',
      url: this._getEndpoint(endpoint),
      responseType: 'json'
    });
  }

  postRequest(endpoint, data) {
    return axios.request({
      method: 'POST',
      url: this._getEndpoint(endpoint),
      responseType: 'json',
      data: data
    });
  }

  deleteRequest(endpoint) {
    return axios.request({
      method: 'POST',
      url: this._getEndpoint(endpoint),
      data: {
          '_method' : 'DELETE'
      },
      responseType: 'json'
    });
  }

  putRequest(endpoint, data) {
    return axios.request({
      method: 'PUT',
      url: this._getEndpoint(endpoint),
      responseType: 'json',
      data: data,
    });
  }
}

export default BaseApi;
