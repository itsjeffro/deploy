import {
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
  PROJECT_UPDATE_FAILURE,
} from '../constants';

import ProjectService from '../../../services/Project';
import { createToast } from "../../alert/alertActions";

export const projectUpdateRequest = () =>({
  type: PROJECT_UPDATE_REQUEST,
});

export const projectUpdateSuccess = (project) =>({
  type: PROJECT_UPDATE_SUCCESS,
  project: project
});

export const projectUpdateFailure = (error) =>({
  type: PROJECT_UPDATE_FAILURE,
  error: error,
});

/**
 * Update item asynchronously.
 *
 * @param {number} projectId
 */
export const updateProject = (projectId, data) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectUpdateRequest());

    projectService
      .update(projectId, data)
      .then(response => {
          dispatch(projectUpdateSuccess(response.data));

          dispatch(createToast('Project updated successfully.'));
        },
        error => {
          dispatch(projectUpdateFailure(error));
        });
  };
};
