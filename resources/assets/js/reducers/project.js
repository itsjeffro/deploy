import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE
} from '../constants/project';

const initialState = {
    project: {}
};

const project = (state = initialState, action) => {
  switch(action.type) {
    case PROJECT_SUCCESS:
      return {
        project: action.project
      }

    default:
      return state;
  }
};

export default project;