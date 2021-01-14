import * as constant from '../serversConstants';
import ServerApi from "../../../services/Api/ServerApi";

export const createServerRequest = (): object =>({
  type: constant.SERVER_CREATE_REQUEST,
});

export const createServerSuccess = (server: object): object =>({
  type: constant.SERVER_CREATE_SUCCESS,
  server: server
});

export const createServerFailure = (errors: any[]): object =>({
  type: constant.SERVER_CREATE_FAILURE,
  errors: errors,
});

export const createServer = (data: object) => {
  return (dispatch) => {
    const serverApi = new ServerApi();

    dispatch(createServerRequest());

    serverApi
      .create(data)
      .then((response) => {
          dispatch(createServerSuccess(response.data));
        },
        (error) => {
          dispatch(createServerFailure(error.response));
        });
  }
};
