import {
  PROJECT_DEPLOYMENT_CREATE_REQUEST,
  PROJECT_DEPLOYMENT_CREATE_SUCCESS,
  PROJECT_DEPLOYMENT_CREATE_FAILURE,
} from '../constants';

import ProjectDeployment from '../../../services/ProjectDeployment';

export const projectDeploymentCreateRequest = () =>({
  type: PROJECT_DEPLOYMENT_CREATE_REQUEST,
});

export const projectDeploymentCreateSuccess = () =>({
  type: PROJECT_DEPLOYMENT_CREATE_SUCCESS,
});

export const projectDeploymentCreateFailure = (error) =>({
  type: PROJECT_DEPLOYMENT_CREATE_FAILURE,
});

/**
 * Add project deployment.
 *
 * @param {number} projectId
 * @param {object} data
 */
export const createProjectDeployment = (projectId, data) => {
  return (dispatch) => {
    const projectDeployment = new ProjectDeployment;

    dispatch(projectDeploymentCreateRequest());

    projectDeployment
      .create(projectId, data)
      .then(response => {
          dispatch(projectDeploymentCreateSuccess());
        },
        error => {
          dispatch(projectDeploymentCreateFailure(error));
        });
  };
};
