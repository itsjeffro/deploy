import * as constant from '../serversConstants';
import ServerApi from "../../../services/Api/ServerApi";

export const deleteServerRequest = (): object =>({
  type: constant.SERVER_DELETE_REQUEST,
});

export const deleteServerSuccess = (serverId: number): object =>({
  type: constant.SERVER_DELETE_SUCCESS,
  serverId: serverId,
});

export const deleteServerFailure = (errors: any[]): object =>({
  type: constant.SERVER_DELETE_FAILURE,
  errors: errors,
});

export const deleteServer = (serverId: number) => {
  return (dispatch) => {
    const serverApi = new ServerApi();
    
    dispatch(deleteServerRequest());
    
    serverApi
      .delete(serverId)
      .then((response) => {
          dispatch(deleteServerSuccess(serverId));
        },
        (error) => {
          dispatch(deleteServerFailure(error.response));
        });
  }
};
