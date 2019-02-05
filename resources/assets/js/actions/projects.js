import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE,
  PROJECTS_UPDATE_REQUEST,
  PROJECTS_UPDATE_SUCCESS,
  PROJECTS_UPDATE_FAILURE,
  PROJECTS_DELETE_REQUEST,
  PROJECTS_DELETE_SUCCESS,
  PROJECTS_DELETE_FAILURE
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

/**
 * Item update is being requested.
 */
export const projectsUpdateRequest = () =>({
  type: PROJECTS_UPDATE_REQUEST
});

/**
 * Item was updated successfully.
 *
 * @param {object} project
 */
export const projectsUpdateSuccess = (project) =>({
  type: PROJECTS_UPDATE_SUCCESS,
  project: project
});

/**
 * Item failed being updated.
 */
export const projectsUpdateFailure = () =>({
  type: PROJECTS_UPDATE_FAILURE
});

/**
 * Update item asynchronously.
 *
 * @param {int} project_id
 * @param {object} data
 */
export const updateProjects = (project_id, data) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectsUpdateRequest());

    projectService
      .update(project_id, data)
      .then(response => {
          dispatch(projectsUpdateSuccess(response.data));
        },
        error => {
          dispatch(projectsUpdateFailure());
        });
  };
};

/**
 * Item delete is being requested.
 */
export const projectsDeleteRequest = () =>({
  type: PROJECTS_DELETE_REQUEST
});

/**
 * Item was deleted successfully.
 *
 * @param {int} project_id
 */
export const projectsDeleteSuccess = (project_id) =>({
  type: PROJECTS_DELETE_SUCCESS,
  project_id: project_id
});

/**
 * Item failed being deleted.
 */
export const projectsDeleteFailure = () =>({
  type: PROJECTS_DELETE_FAILURE
});

/**
 * Delete item asynchronously.
 *
 * @param {int} project_id
 */
export const deleteProjects = (project_id) => {
  return (dispatch) => {
    const projectService = new ProjectService;

    dispatch(projectsDeleteRequest());

    projectService
      .delete(project_id)
      .then(response => {
          dispatch(projectsDeleteSuccess(project_id));
        },
        error => {
          dispatch(projectsDeleteFailure());
        });
  };
};