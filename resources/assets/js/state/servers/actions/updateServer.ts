import * as constant from '../serversConstants';
import ServerApi from "../../../services/Api/ServerApi";

export const updateServerRequest = (): object =>({
  type: constant.SERVER_UPDATE_REQUEST,
});

export const updateServerSuccess = (server: object): object =>({
  type: constant.SERVER_UPDATE_SUCCESS,
  server: server
});

export const updateServerFailure = (errors: any[]): object =>({
  type: constant.SERVER_UPDATE_FAILURE,
  errors: errors,
});

export const updateServer = (serverId: number, data: object) => {
  return (dispatch) => {
    const serverApi = new ServerApi();
    
    dispatch(updateServerRequest());
  
    serverApi
      .update(serverId, data)
      .then((response) => {
          dispatch(updateServerSuccess(response.data));
        },
        (error) => {
          dispatch(updateServerFailure(error.response));
        });
  }
};
