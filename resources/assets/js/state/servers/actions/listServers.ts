import * as constant from '../serversConstants';
import ServerApi from "../../../services/Api/ServerApi";

export const listServersRequest = (): object =>({
  type: constant.SERVERS_REQUEST,
});

export const listServersSuccess = (servers: object): object =>({
  type: constant.SERVERS_SUCCESS,
  servers: servers,
});

export const listServersFailure = (errors: any[]): object =>({
  type: constant.SERVERS_FAILURE,
  errors: errors,
});

export const listServers = (options?: object) => {
  return (dispatch) => {
    const serverApi = new ServerApi();
    
    dispatch(listServersRequest());
    
    serverApi
      .list(options || {})
      .then((response) => {
          dispatch(listServersSuccess(response.data.data));
        },
        (error) => {
          dispatch(listServersFailure(error.response));
        });
  }
};
