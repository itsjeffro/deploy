import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE
} from '../constants/projects';

const initialState = {
    isFetching: false,
    items: {}
};

const projects = (state = initialState, action) => {
  switch(action.type) {
    case PROJECTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })

    case PROJECTS_SUCCESS:
      return {
        isFetching: false,
        items: action.projects
      }

    default:
      return state;
  }
};

export default projects;
