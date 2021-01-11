import * as constants from '../constants';
import ServerApi from '../../../services/Api/ServerApi';
  
export const updateProjectServerRequest = () =>({
  type: constants.PROJECT_SERVER_UPDATE_REQUEST
});

export const updateProjectServerSuccess = (server: object) =>({
  type: constants.PROJECT_SERVER_UPDATE_SUCCESS,
  server: server,
});

export const updateProjectServerFailure = (errors: any[]) =>({
  type: constants.PROJECT_SERVER_UPDATE_FAILURE,
  errors: errors,
});

export const updateProjectServer = (projectId: number, serverId: number, data: object) => {
  return (dispatch: any) => {
    const serverApi = new ServerApi();

    dispatch(updateProjectServerRequest());
  
    serverApi
      .update(serverId, data)
      .then((response: any) => {
          dispatch(updateProjectServerSuccess(response.data));
        },
        (error: any) => {
          dispatch(updateProjectServerFailure(error.response));
        });
  };
};
