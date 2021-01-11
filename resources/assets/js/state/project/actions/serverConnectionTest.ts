import * as constants from '../constants';
import ServerTestConnectionApi from "../../../services/Api/ServerTestConnectionApi";

export const testServerConnectionRequest = (serverId) =>({
  type: constants.TEST_SERVER_CONNECTION_REQUEST,
  serverId: serverId,
});

export const testServerConnectionSuccess = () =>({
  type: constants.TEST_SERVER_CONNECTION_SUCCESS,
});

export const testServerConnectionFailure = (error) =>({
  type: constants.TEST_SERVER_CONNECTION_FAILURE,
  error: error,
});

export const updateServerConnectionStatus = (serverId, connectionStatus) =>({
  type: constants.UPDATE_SERVER_CONNECTION_STATUS,
  serverId: serverId,
  connectionStatus: connectionStatus
});

/**
 * Tests the projects specified server connection.
 */
export const testServerConnection = (projectId: number, serverId: number) => {
  return (dispatch) => {
    const serverTestConnectionApi = new ServerTestConnectionApi();

    dispatch(testServerConnectionRequest(serverId));

    serverTestConnectionApi
      .get(projectId, serverId)
      .then(response => {
          dispatch(testServerConnectionSuccess());
        },
        error => {
          dispatch(testServerConnectionFailure(error));
        });
  };
};
