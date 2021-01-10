import * as constant from '../serversConstants';
import ServerApi from "../../../services/Api/ServerApi";

export const getServerRequest = (): object =>({
  type: constant.SERVER_REQUEST,
});

export const getServerSuccess = (server: object): object =>({
  type: constant.SERVER_SUCCESS,
  server: server
});

export const getServerFailure = (errors: any[]): object =>({
  type: constant.SERVER_FAILURE,
  errors: errors,
});

export const getServer = (serverId: number) => {
  return (dispatch) => {
    const serverApi = new ServerApi();
    
    dispatch(getServerRequest());
  
    serverApi
      .get(serverId)
      .then((response) => {
          dispatch(getServerSuccess(response.data));
        },
        (error) => {
          dispatch(getServerFailure(error.response));
        });
  }
};
