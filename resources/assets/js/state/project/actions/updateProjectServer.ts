import { PROJECT_SERVER_UPDATE_REQUEST, PROJECT_SERVER_UPDATE_SUCCESS, PROJECT_SERVER_UPDATE_FAILURE } from '../constants';
import ProjectServer from '../../../services/ProjectServer';
  
  export const updateProjectServerRequest = () =>({
    type: PROJECT_SERVER_UPDATE_REQUEST
  });
  
  export const updateProjectServerSuccess = (server: object) =>({
    type: PROJECT_SERVER_UPDATE_SUCCESS,
    server: server,
  });
  
  export const updateProjectServerFailure = (errors: any[]) =>({
    type: PROJECT_SERVER_UPDATE_FAILURE,
    errors: errors,
  });
  
  export const updateProjectServer = (projectId: number, serverId: number, data: object) => {
    return (dispatch: any) => {
      const projectServerApi = new ProjectServer();
  
      dispatch(updateProjectServerRequest());
  
      projectServerApi
        .put(projectId, serverId, data)
        .then((response: any) => {
            dispatch(updateProjectServerSuccess(response.data));
          },
          (error: any) => {
            dispatch(updateProjectServerFailure(error.response));
          });
    };
  };
