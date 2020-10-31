import { Deploy } from '../../config';

class BaseApi {
  private axios: any;

  constructor() {
    const axiosWindow: any = window;

    this.axios = axiosWindow.axios;
  }

  private getEndpoint(endpoint: string): string {
    let apiEndpoint = endpoint.replace(/\/+/, "");
    let path = Deploy.path.replace(/\/+$/, "");

    if (path !== "") {
      path = "/" + Deploy.path;
    }

    return Deploy.url + path + "/" + apiEndpoint;
  }

  public getRequest(endpoint: string) {
    return this.axios.request({
      method: 'GET',
      url: this.getEndpoint(endpoint),
      responseType: 'json'
    });
  }

  public postRequest(endpoint: string, data?: object) {
    return this.axios.request({
      method: 'POST',
      url: this.getEndpoint(endpoint),
      responseType: 'json',
      data: data
    });
  }

  public deleteRequest(endpoint: string) {
    return this.axios.request({
      method: 'POST',
      url: this.getEndpoint(endpoint),
      data: {
          '_method' : 'DELETE'
      },
      responseType: 'json'
    });
  }

  public putRequest(endpoint: string, data?: object) {
    return this.axios.request({
      method: 'PUT',
      url: this.getEndpoint(endpoint),
      responseType: 'json',
      data: data,
    });
  }
}

export default BaseApi;
