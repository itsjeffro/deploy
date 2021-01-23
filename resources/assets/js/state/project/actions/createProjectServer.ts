import * as constants from '../constants';
import ServerApi from '../../../services/Api/ServerApi';
import ProjectServerApi from "../../../services/Api/ProjectServerApi";

export const createProjectServerRequest = (): object =>({
  type: constants.PROJECT_SERVER_CREATE_REQUEST
});

export const createProjectServerSuccess = (): object =>({
  type: constants.PROJECT_SERVER_CREATE_SUCCESS,
});

export const createProjectServerFailure = (errors: any[]): object =>({
  type: constants.PROJECT_SERVER_CREATE_FAILURE,
  errors: errors,
});

export const createProjectServer = (projectId: number, data: object) => {
  return (dispatch: any) => {
    const projectServerApi = new ProjectServerApi();

    dispatch(createProjectServerRequest());
  
    projectServerApi
      .create(projectId, data)
      .then((response: any) => {
          dispatch(createProjectServerSuccess());
        },
        (error: any) => {
          dispatch(createProjectServerFailure(error.response));
        });
  };
};
