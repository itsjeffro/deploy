import { PROJECTS_UPDATE_REQUEST, PROJECTS_UPDATE_SUCCESS, PROJECTS_UPDATE_FAILURE } from '../projectsConstants';
import ProjectService from '../../../services/Project';

export const updateProjectRequest = (): object =>({
  type: PROJECTS_UPDATE_REQUEST
});

export const updateProjectSuccess = (project: object): object =>({
  type: PROJECTS_UPDATE_SUCCESS,
  project: project
});

export const updateProjectFailure = (errors: any[]): object =>({
  type: PROJECTS_UPDATE_FAILURE,
  errors: errors,
});

export const updateProject = (project_id: number, data: object) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(updateProjectRequest());

    projectService
      .update(project_id, data)
      .then((response) => {
        dispatch(updateProjectSuccess(response.data));
      },
      (error) => {
        dispatch(updateProjectFailure(error.response));
      });
  }
};
