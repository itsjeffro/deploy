import { PROJECTS_DELETE_REQUEST, PROJECTS_DELETE_SUCCESS, PROJECTS_DELETE_FAILURE } from '../projectsConstants';
import { createToast } from '../../alert/alertActions';
import ProjectService from '../../../services/Project';

export const deleteProjectRequest = (): object =>({
  type: PROJECTS_DELETE_REQUEST
});

export const deleteProjectSuccess = (projectId: number): object =>({
  type: PROJECTS_DELETE_SUCCESS,
  project_id: projectId
});

export const deleteProjectFailure = (): object =>({
  type: PROJECTS_DELETE_FAILURE
});

export const deleteProject = (projectId: number): object => {
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
        dispatch(deleteProjectFailure());
      });
  }
};
