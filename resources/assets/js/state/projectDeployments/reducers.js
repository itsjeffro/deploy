import { initialState } from './state';

import {
  PROJECT_DEPLOYMENTS_REQUEST,
  PROJECT_DEPLOYMENTS_SUCCESS,
  PROJECT_DEPLOYMENTS_FAILURE,
  PROJECT_DEPLOYMENT_CREATE_REQUEST,
  PROJECT_DEPLOYMENT_CREATE_SUCCESS,
  PROJECT_DEPLOYMENT_CREATE_FAILURE,
  PROJECT_DEPLOYMENT_DEPLOYING,
  PROJECT_DEPLOYMENT_DEPLOYED,
} from './constants';

const projectDeployments = (state = initialState, action) => {
  switch(action.type) {
    case PROJECT_DEPLOYMENTS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case PROJECT_DEPLOYMENTS_SUCCESS:
      return {
        items: action.deployments,
        isFetching: false
      };
    case PROJECT_DEPLOYMENTS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case PROJECT_DEPLOYMENT_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true
      };
    case PROJECT_DEPLOYMENT_CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false
      };
    case PROJECT_DEPLOYMENT_CREATE_FAILURE:
      return {
        ...state,
        isCreating: false
      };
    case PROJECT_DEPLOYMENT_DEPLOYING:
      return {
        ...state,
        items: [action.deployment].concat(state.items.slice(0, 4)),
      };
    case PROJECT_DEPLOYMENT_DEPLOYED:
      const deployments =  state.items.map(deployment => {
        if (deployment.id === action.deployment.id) {
          return {
            ...deployment,
            status: action.deployment.status,
          };
        }
        return deployment;
      });

      return {
        ...state,
        items: deployments,
      };

    default:
      return state;
  }
};

export default projectDeployments;
