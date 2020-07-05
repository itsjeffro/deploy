import { PROJECTS_DELETE_REQUEST, PROJECTS_DELETE_SUCCESS, PROJECTS_DELETE_FAILURE } from '../projectsConstants';
import { createToast } from '../../alert/alertActions';
import ProjectService from '../../../services/Project';

/**
 * @returns {void}
 */
export const deleteProjectRequest = () =>({
  type: PROJECTS_DELETE_REQUEST
});

/**
 * @param {int} projectId
 * @returns {void}
 */
export const deleteProjectSuccess = (projectId) =>({
  type: PROJECTS_DELETE_SUCCESS,
  project_id: projectId
});

/**
 * @returns {void}
 */
export const deleteProjectFailure = () =>({
  type: PROJECTS_DELETE_FAILURE
});

/**
 * @param {*} projectId
 * @returns {void}
 */
export const deleteProject = (projectId) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(deleteProjectRequest());

    projectService
      .delete(projectId)
      .then(response => {
        dispatch(deleteProjectSuccess(projectId));

        dispatch(createToast('Project deleted successfully.'));
      },
      error => {
        dispatch(projectsDeleteFailure());
      });
  }
};
