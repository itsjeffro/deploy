import {buildAlertFromResponse} from '../utils/alert';

import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE,
  PROJECTS_CREATE_REQUEST,
  PROJECTS_CREATE_SUCCESS,
  PROJECTS_CREATE_FAILURE,
  PROJECTS_UPDATE_REQUEST,
  PROJECTS_UPDATE_SUCCESS,
  PROJECTS_UPDATE_FAILURE,
  PROJECTS_DELETE_REQUEST,
  PROJECTS_DELETE_SUCCESS,
  PROJECTS_DELETE_FAILURE
} from '../constants/projects';

const initialState = {
  errors: [],
  isCreating: false,
  isCreated: false,
  isDeleting: false,
  isUpdating: false,
  isFetching: false,
  items: [],
};

const projects = (state = initialState, action) => {
  switch(action.type) {
    case PROJECTS_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case PROJECTS_SUCCESS:
      return {
        ...state,
        errors: [],
        isFetching: false,
        items: action.projects,
      };

    case PROJECTS_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
        isCreated: false,
      };

    case PROJECTS_CREATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isCreating: false,
        isCreated: true,
        items: state.items.concat(action.project)
      };

    case PROJECTS_CREATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isCreating: false,
        isCreated: false,
      };
      
    case PROJECTS_UPDATE_REQUEST:
      return {
        ...state,
        errors: [],
        isUpdating: true,
      };
      
    case PROJECTS_UPDATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isUpdating: false,
      };

    case PROJECTS_DELETE_REQUEST:
      return {
        ...state,
        errors: [],
        isDeleting: true
      };
      
    case PROJECTS_DELETE_SUCCESS:
      return {
        ...state,
        errors: [],
        isDeleting: false,
        items: state.items.filter(item => {
          return item !== action.project_id;
        }),
      };

    default:
      return state;
  }
};

export default projects;