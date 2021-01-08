import {
  PROJECT_SERVER_REMOVE_REQUEST,
  PROJECT_SERVER_REMOVE_SUCCESS,
  PROJECT_SERVER_REMOVE_FAILURE
} from '../constants';

import ProjectServerService from "../../../services/ProjectServer";
import { createToast } from "../../alert/alertActions";

export const projectServerRemoveRequest = () =>({
  type: PROJECT_SERVER_REMOVE_REQUEST,
});

export const projectServerRemoveSuccess = (serverId) =>({
  type: PROJECT_SERVER_REMOVE_SUCCESS,
  serverId: serverId,
});

export const projectServerRemoveFailure = (error) =>({
  type: PROJECT_SERVER_REMOVE_FAILURE,
});

/**
 * Remove server from project.
 *
 * @param {number} projectId
 * @param {number} serverId
 */
export const removeProjectServer = (projectId, serverId) => {
  return (dispatch) => {
    dispatch(projectServerRemoveRequest());

    const projectServerService = new ProjectServerService;

    projectServerService
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
