import { PROJECTS_REQUEST, PROJECTS_SUCCESS, PROJECTS_FAILURE } from '../projectsConstants';
import ProjectService from '../../../services/Project';

/**
 * @returns {void}
 */
export const projectsRequest = () => ({
  type: PROJECTS_REQUEST
});

/**
 * @param {Array} projects
 * @returns {void}
 */
export const projectsSuccess = (projects) => ({
  type: PROJECTS_SUCCESS,
  projects: projects
});

/**
 * @returns {void}
 */
export const projectsFailure = () => ({
  type: PROJECTS_FAILURE
});

/**
 * @returns {void}
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
  }
};
