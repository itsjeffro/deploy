import {
  PROJECT_DEPLOYMENTS_REQUEST,
  PROJECT_DEPLOYMENTS_SUCCESS,
  PROJECT_DEPLOYMENTS_FAILURE,
} from '../constants';

import ProjectDeployment from '../../../services/ProjectDeployment';

export const projectDeploymentsRequest = () =>({
  type: PROJECT_DEPLOYMENTS_REQUEST,
});

export const projectDeploymentsSuccess = (deployments) =>({
  type: PROJECT_DEPLOYMENTS_SUCCESS,
  deployments: deployments,
});

export const projectDeploymentsFailure = (error) =>({
  type: PROJECT_DEPLOYMENTS_FAILURE,
  error: error,
});

/**
 * Fetch items asynchronously.
 *
 * @param {number} projectId
 */
export const fetchProjectDeployments = (projectId) => {
  return (dispatch) => {
    const projectDeployment = new ProjectDeployment;

    dispatch(projectDeploymentsRequest());

    projectDeployment
      .index(projectId)
      .then(response => {
          dispatch(projectDeploymentsSuccess(response.data));
        },
        error => {
          dispatch(projectDeploymentsFailure(error));
        });
  };
};
