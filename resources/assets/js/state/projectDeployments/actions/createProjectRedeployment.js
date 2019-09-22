import {
  PROJECT_REDEPLOYMENT_CREATE_REQUEST,
  PROJECT_REDEPLOYMENT_CREATE_SUCCESS,
  PROJECT_REDEPLOYMENT_CREATE_FAILURE,
} from '../constants';

import ProjectRedeploymentService from "../../../services/ProjectRedeployment";

export const projectRedeploymentCreateRequest = () =>({
  type: PROJECT_REDEPLOYMENT_CREATE_REQUEST,
});

export const projectRedeploymentCreateSuccess = () =>({
  type: PROJECT_REDEPLOYMENT_CREATE_SUCCESS,
});

export const projectRedeploymentCreateFailure = (error) =>({
  type: PROJECT_REDEPLOYMENT_CREATE_FAILURE,
  error: error,
});

/**
 * Add project redeployment.
 *
 * @param {number} deploymentId
 */
export const createProjectRedeployment = (deploymentId) => {
  return (dispatch) => {
    const projectRedeploymentService = new ProjectRedeploymentService;

    dispatch(projectRedeploymentCreateRequest());

    projectRedeploymentService
      .create({
        deployment_id: deploymentId
      })
      .then(response => {
          dispatch(projectRedeploymentCreateSuccess());
        },
        error => {
          dispatch(projectRedeploymentCreateFailure(error));
        });
  };
};
