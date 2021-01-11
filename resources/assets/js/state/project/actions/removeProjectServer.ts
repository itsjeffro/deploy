import * as constants from '../constants';
import ProjectServerApi from "../../../services/Api/ProjectServerApi";
import { createToast } from "../../alert/alertActions";

export const projectServerRemoveRequest = () => ({
  type: constants.PROJECT_SERVER_REMOVE_REQUEST,
});

export const projectServerRemoveSuccess = (serverId: number): object => ({
  type: constants.PROJECT_SERVER_REMOVE_SUCCESS,
  serverId: serverId,
});

export const projectServerRemoveFailure = (error): object => ({
  type: constants.PROJECT_SERVER_REMOVE_FAILURE,
});

/**
 * Remove server from project.
 */
export const removeProjectServer = (projectId: number, serverId: number) => {
  return (dispatch) => {
    dispatch(projectServerRemoveRequest());

    const projectServerApi = new ProjectServerApi;
  
    projectServerApi
      .delete(projectId, serverId)
      .then(response => {
          dispatch(projectServerRemoveSuccess(serverId));

          dispatch(createToast('Server removed successfully.'));
        },
        error => {
          dispatch(projectServerRemoveFailure(error))
        });
  };
};
