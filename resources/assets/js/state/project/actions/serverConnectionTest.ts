import ProjectServerConnectionService from '../../../services/ProjectServerConnection';

import {
  TEST_SERVER_CONNECTION_REQUEST,
  TEST_SERVER_CONNECTION_SUCCESS,
  TEST_SERVER_CONNECTION_FAILURE,
  UPDATE_SERVER_CONNECTION_STATUS,
} from '../constants';

export const testServerConnectionRequest = (serverId) =>({
  type: TEST_SERVER_CONNECTION_REQUEST,
  serverId: serverId,
});

export const testServerConnectionSuccess = () =>({
  type: TEST_SERVER_CONNECTION_SUCCESS,
});

export const testServerConnectionFailure = (error) =>({
  type: TEST_SERVER_CONNECTION_FAILURE,
  error: error,
});

export const updateServerConnectionStatus = (serverId, connectionStatus) =>({
  type: UPDATE_SERVER_CONNECTION_STATUS,
  serverId: serverId,
  connectionStatus: connectionStatus
});

/**
 * Tests the projects specified server connection.
 *
 * @param {number} projectId
 * @param {number} serverId
 */
export const testServerConnection = (projectId, serverId) => {
  return (dispatch) => {
    const projectServerConnectionService = new ProjectServerConnectionService;

    dispatch(testServerConnectionRequest(serverId));

    projectServerConnectionService
      .get(projectId, serverId)
      .then(response => {
          dispatch(testServerConnectionSuccess());
        },
        error => {
          dispatch(testServerConnectionFailure(error));
        });
  };
};
