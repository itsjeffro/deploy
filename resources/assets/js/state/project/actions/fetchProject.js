import {
  PROJECT_FETCH_REQUEST,
  PROJECT_FETCH_SUCCESS,
  PROJECT_FETCH_FAILURE
} from '../constants';

import ProjectService from '../../../services/Project';

/**
 * Item is being requested.
 */
export const fetchProjectRequest = () =>({
  type: PROJECT_FETCH_REQUEST
});

/**
 * Item was fetch successfully.
 *
 * @param {object} project
 */
export const fetchProjectSuccess = (project) =>({
  type: PROJECT_FETCH_SUCCESS,
  project: project
});

/**
 * Item failed being fetched.
 *
 * @param {object} error
 */
export const fetchProjectFailure = (error) =>({
  type: PROJECT_FETCH_FAILURE
});

/**
 * Fetch item asynchronously.
 *
 * @param {number} projectId
 */
export const fetchProject = (projectId) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(fetchProjectRequest());

    projectService
      .get(projectId)
      .then(response => {
          dispatch(fetchProjectSuccess(response.data));
        },
        error => {
          dispatch(fetchProjectFailure(error));
        });
  };
};
