import {
  PROJECT_DEPLOYMENT_DEPLOYING,
  PROJECT_DEPLOYMENT_DEPLOYED,
} from '../constants';

export const projectDeploymentDeploying = (deployment) =>({
  type: PROJECT_DEPLOYMENT_DEPLOYING,
  deployment: deployment,
});

export const projectDeploymentDeployed = (deployment) =>({
  type: PROJECT_DEPLOYMENT_DEPLOYED,
  deployment: deployment,
});