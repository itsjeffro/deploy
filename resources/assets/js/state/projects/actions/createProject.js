import { PROJECTS_CREATE_REQUEST, PROJECTS_CREATE_SUCCESS, PROJECTS_CREATE_FAILURE } from '../projectsConstants';
import ProjectService from '../../../services/Project';

/**
 * @returns {void}
 */
export const createProjectRequest = () => ({
  type: PROJECTS_CREATE_REQUEST
});

/**
 * @param {object} project
 * @returns {void}
 */
export const createProjectSuccess = (project) => ({
  type: PROJECTS_CREATE_SUCCESS,
  project: project
});

/**
 * @param {object} errors
 * @returns {void}
 */
export const createProjectFailure = (errors) => ({
  type: PROJECTS_CREATE_FAILURE,
  errors: errors,
});

/**
 * @param {object} input
 * @returns {void}
 */
export const createProject = (input) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(createProjectRequest());

    projectService
      .post(input)
      .then(response => {
        dispatch(createProjectSuccess(response.data));
      },
      error => {
        dispatch(createProjectFailure(error.response));
      });
  }
};
