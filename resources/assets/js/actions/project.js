import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE
} from '../constants/project';

export const projectRequest = () =>({
  type: PROJECT_REQUEST
});

export const projectSuccess = (project) =>({
  type: PROJECT_SUCCESS,
  project: project
});

export const projectFailure = () =>({
  type: PROJECT_FAILURE
});