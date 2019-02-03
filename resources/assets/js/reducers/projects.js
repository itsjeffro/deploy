import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE,
  PROJECTS_DELETE_REQUEST,
  PROJECTS_DELETE_SUCCESS,
  PROJECTS_DELETE_FAILURE
} from '../constants/projects';

const initialState = {
    isFetching: false,
    items: []
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
      
    case PROJECTS_DELETE_SUCCESS:
      return {
        items: state.items.filter(item => {
          return item.id !== action.project_id;
        });
      }

    default:
      return state;
  }
};

export default projects;