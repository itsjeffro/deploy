import * as constant from '../serversConstants';
import ProjectServerApi from "../../../services/Api/ProjectServerApi";

export const addProjectServerRequest = (): object =>({
  type: constant.PROJECT_SERVER_ADD_REQUEST,
});

export const addProjectServerSuccess = (server: object): object =>({
  type: constant.PROJECT_SERVER_ADD_SUCCESS,
  server: server
});

export const addProjectServerFailure = (errors: any[]): object =>({
  type: constant.PROJECT_SERVER_ADD_FAILURE,
  errors: errors,
});

export const addProjectServer = (projectId: number, data: object) => {
  return (dispatch) => {
    const projectServerApi = new ProjectServerApi();

    dispatch(addProjectServerRequest());

    projectServerApi
      .create(projectId, data)
      .then((response) => {
          dispatch(addProjectServerSuccess(response.data));
        },
        (error) => {
          dispatch(addProjectServerFailure(error.response));
        });
  }
};
