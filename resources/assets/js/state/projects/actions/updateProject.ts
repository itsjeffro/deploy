import { PROJECTS_UPDATE_REQUEST, PROJECTS_UPDATE_SUCCESS, PROJECTS_UPDATE_FAILURE } from '../projectsConstants';
import ProjectService from '../../../services/Project';

/**
 * @returns {void}
 */
export const updateProjectRequest = () =>({
  type: PROJECTS_UPDATE_REQUEST
});

/**
 * @param {object} project
 * @returns {void}
 */
export const updateProjectSuccess = (project) =>({
  type: PROJECTS_UPDATE_SUCCESS,
  project: project
});

/**
 * @returns {void}
 */
export const updateProjectFailure = () =>({
  type: PROJECTS_UPDATE_FAILURE
});

/**
 * @param {int} project_id
 * @param {object} data
 */
export const updateProject = (project_id, data) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(updateProjectRequest());

    projectService
      .update(project_id, data)
      .then(response => {
        dispatch(updateProjectSuccess(response.data));
      },
      error => {
        dispatch(updateProjectFailure());
      });
  }
};
