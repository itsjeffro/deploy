import {
  PROJECT_UPDATE_KEY_REQUEST,
  PROJECT_UPDATE_KEY_SUCCESS,
  PROJECT_UPDATE_KEY_FAILURE
} from '../constants';

import ProjectKeyService from '../../../services/ProjectKey';

export const updateKeyRequest = () =>({
  type: PROJECT_UPDATE_KEY_REQUEST
});

export const updateKeySuccess = (key) =>({
  type: PROJECT_UPDATE_KEY_SUCCESS,
  key: key
});

export const updateKeyFailure = () =>({
  type: PROJECT_UPDATE_KEY_FAILURE
});

/**
 * Updates project key.
 *
 * @param {number} projectId
 */
export const updateProjectKey = (projectId) => {
  return (dispatch) => {
    const projectKeyService = new ProjectKeyService;

    dispatch(updateKeyRequest());

    projectKeyService
      .put(projectId)
      .then(response => {
          dispatch(updateKeySuccess(response.data.key));
        },
        error => {
          dispatch(updateKeyFailure());
        });
  };
};
