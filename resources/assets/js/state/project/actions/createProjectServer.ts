import * as constants from '../constants';
import ProjectServer from '../../../services/ProjectServer';

export const createProjectServerRequest = () =>({
  type: constants.PROJECT_SERVER_CREATE_REQUEST
});

export const createProjectServerSuccess = () =>({
  type: constants.PROJECT_SERVER_CREATE_SUCCESS,
});

export const createProjectServerFailure = (errors: any[]) =>({
  type: constants.PROJECT_SERVER_CREATE_FAILURE,
  errors: errors,
});

export const createProjectServer = (projectId: number, data: object) => {
  return (dispatch: any) => {
    const projectServerApi = new ProjectServer();

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
