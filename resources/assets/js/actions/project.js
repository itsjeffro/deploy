import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE
} from '../constants/project';

import ProjectService from '../services/Project';

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
 */
export const projectFailure = () =>({
  type: PROJECT_FAILURE
});

/**
 * Fetch item asynchronously.
 *
 * @param {object} project
 */
export const fetchProject = (project_id) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectRequest());

    projectService
      .get(project_id)
      .then(response => {
          dispatch(projectSuccess(response.data));
        },
        error => {
          dispatch(projectFailure());
        });
  };
};
