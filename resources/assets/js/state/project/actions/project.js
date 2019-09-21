import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE
} from '../constants';

import ProjectService from '../../../services/Project';

/**
 * Item is being requested.
 */
export const projectRequest = () =>({
  type: PROJECT_REQUEST
});

/**
 * Item was fetch successfully.
 *
 * @param {object} project
 */
export const projectSuccess = (project) =>({
  type: PROJECT_SUCCESS,
  project: project
});

/**
 * Item failed being fetched.
 *
 * @param {object} error
 */
export const projectFailure = (error) =>({
  type: PROJECT_FAILURE
});

/**
 * Fetch item asynchronously.
 *
 * @param {number} projectId
 */
export const fetchProject = (projectId) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectRequest());

    projectService
      .get(projectId)
      .then(response => {
          dispatch(projectSuccess(response.data));
        },
        error => {
          dispatch(projectFailure(error));
        });
  };
};
