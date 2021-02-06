import * as constant from '../serversConstants';
import ServerTestConnectionApi from "../../../services/Api/ServerTestConnectionApi";

export const testServerConnectionRequest = (): object =>({
  type: constant.TEST_SERVER_CONNECTION_REQUEST,
});

export const testServerConnectionSuccess = (serverId: number): object =>({
  type: constant.TEST_SERVER_CONNECTION_SUCCESS,
  serverId: serverId,
});

export const testServerConnectionFailure = (errors: any[]): object =>({
  type: constant.TEST_SERVER_CONNECTION_FAILURE,
  errors: errors,
});

export const testServerConnection = (serverId: number) => {
  return (dispatch) => {
    const serverTestConnectionApi = new ServerTestConnectionApi();

    dispatch(testServerConnectionRequest());

    serverTestConnectionApi
      .get(serverId)
      .then((response) => {
          dispatch(testServerConnectionSuccess(serverId));
        },
        (error) => {
          dispatch(testServerConnectionFailure(error.response));
        });
  }
};
