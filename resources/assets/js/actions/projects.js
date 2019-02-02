import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE
} from '../constants/projects';

import ProjectService from '../services/Project';

/**
 * Items are being requested.
 */
export const projectsRequest = () =>({
  type: PROJECTS_REQUEST
});

/**
 * Items were fetched successfully.
 *
 * @param {Array} projects
 */
export const projectsSuccess = (projects) =>({
  type: PROJECTS_SUCCESS,
  projects: projects
});

/**
 * Items failed being fetched.
 */
export const projectsFailure = () =>({
  type: PROJECTS_FAILURE
});

/**
 * Fetch items asynchronously.
 *
 * @param {object} projects
 */
export const fetchProjects = () => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectsRequest());

    projectService
      .index()
      .then(response => {
          dispatch(projectsSuccess(response.data));
        },
        error => {
          dispatch(projectsFailure());
        });
  };
};