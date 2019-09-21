import ProjectDeployment from '../../services/ProjectDeployment';

/**
 * Items are being requested.
 */
export const projectDeploymentsRequest = () =>({
  type: 'PROJECT_DEPLOYMENTS_REQUEST'
});

/**
 * Items were fetch successfully.
 *
 * @param {array} deployments
 */
export const projectDeploymentsSuccess = (deployments) =>({
  type: 'PROJECT_DEPLOYMENTS_SUCCESS',
  deployments: deployments
});

/**
 * Items failed being fetched.
 *
 * @param {object} errors
 */
export const projectDeploymentsFailure = (errors) =>({
  type: 'PROJECT_DEPLOYMENTS_FAILURE'
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
