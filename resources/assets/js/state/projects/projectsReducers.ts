import {buildAlertFromResponse} from '../../utils/alert';

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
} from './projectsConstants';

const initialState = {
  errors: [],
  isCreating: false,
  isCreated: false,
  isDeleting: false,
  isDeleted: false,
  isUpdating: false,
  isUpdated: false,
  isFetching: false,
  items: [],
};

const projects = (state = initialState, action) => {
  switch(action.type) {
    // Fetch
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
        items: action.projects.reduce((previous, project) => {
          previous[project.id] = project;
          return previous;
        }, {}),
      };

    // Create
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
        items: {
          ...state.items,
          [action.project.id]: action.project
        }
      };

    case PROJECTS_CREATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isCreating: false,
        isCreated: false,
      };

    // Update
    case PROJECTS_UPDATE_REQUEST:
      return {
        ...state,
        errors: [],
        isUpdating: true,
        isUpdated: false,
      };

    case PROJECTS_UPDATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isUpdating: false,
        isUpdated: true,
      };

    case PROJECTS_UPDATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isUpdating: false,
        isUpdated: false,
      };

    // Delete
    case PROJECTS_DELETE_REQUEST:
      return {
        ...state,
        errors: [],
        isDeleting: true,
        isDeleted: false,
      };

    case PROJECTS_DELETE_SUCCESS:
      return {
        ...state,
        errors: [],
        isDeleting: false,
        isDeleted: true,
        items: Object.keys(state.items).reduce((previous, key) => {
          if (action.project_id != key) {
            previous[key] = state.items[key];
          }

          return previous;
        }, {}),
      };

    default:
      return state;
  }
};

export default projects;
