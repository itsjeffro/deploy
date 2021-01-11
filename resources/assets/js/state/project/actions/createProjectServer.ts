import * as constants from '../constants';
import ServerApi from '../../../services/Api/ServerApi';

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
    const serverApi = new ServerApi();

    dispatch(createProjectServerRequest());
  
    serverApi
      .create(data)
      .then((response: any) => {
          dispatch(createProjectServerSuccess());
        },
        (error: any) => {
          dispatch(createProjectServerFailure(error.response));
        });
  };
};
