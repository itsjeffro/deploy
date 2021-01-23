import * as constants from './serversConstants';
import { buildAlertFromResponse } from '../../utils/alert';

const initialState = {
  item: {},
  items: [],
  errors: [],
  isCreating: false,
  isCreated: false,
  isFetching: false,
  isUpdating: false,
  isUpdated: false,
  isDeleting: false,
};

const serversReducers = (state = initialState, action) => {
  switch(action.type) {
    // Update server
    case constants.SERVER_UPDATE_REQUEST:
      return {
        ...state,
        errors: [],
        isUpdating: true,
        isUpdated: false,
      };
    
    case constants.SERVER_UPDATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isUpdating: false,
        isUpdated: true,
      };
      
    case constants.SERVER_UPDATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isUpdating: false,
        isUpdated: false,
      };

    // Create server
    case constants.SERVER_CREATE_REQUEST:
      return {
        ...state,
        errors: [],
        isCreating: true,
        isCreated: false,
      };

    case constants.SERVER_CREATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isCreating: false,
        isCreated: true,
      };

    case constants.SERVER_CREATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isCreating: false,
        isCreated: false,
      };

    // Get server
    case constants.SERVER_REQUEST:
      return {
        ...state,
        item: {},
        errors: [],
        isFetching: true,
      };
  
    case constants.SERVER_SUCCESS:
      return {
        ...state,
        item: action.server,
        errors: [],
        isFetching: false,
      };
  
    case constants.SERVER_FAILURE:
      return {
        ...state,
        item: {},
        errors: buildAlertFromResponse(action.errors),
        isFetching: false,
      };
      
    // Delete server
    case constants.SERVER_DELETE_REQUEST:
      return {
        ...state,
        errors: [],
        isDeleting: true,
      };
  
    case constants.SERVER_DELETE_SUCCESS:
      return {
        ...state,
        errors: [],
        isDeleting: false,
      };
  
    case constants.SERVER_DELETE_FAILURE:
      return {
        ...state,
        errors: [],
        isDeleting: false,
      };
  
    // List servers
    case constants.SERVERS_REQUEST:
      return {
        ...state,
        items: [],
        errors: [],
        isFetching: true,
      };
  
    case constants.SERVERS_SUCCESS:
      return {
        ...state,
        items: action.servers,
        errors: [],
        isFetching: false,
      };
  
    case constants.SERVERS_FAILURE:
      return {
        ...state,
        items: [],
        isFetching: false,
      };

    // Add server to project
    case constants.PROJECT_SERVER_ADD_REQUEST:
      return {
        ...state,
        errors: [],
        isCreating: true,
        isCreated: false,
      };

    case constants.PROJECT_SERVER_ADD_SUCCESS:
      return {
        ...state,
        errors: [],
        isCreating: false,
        isCreated: true,
      };

    case constants.PROJECT_SERVER_ADD_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isCreating: false,
        isCreated: false,
      };
      
    default:
      return state;
  }
};

export default serversReducers;
