import * as constants from './constants';
import { initialState } from './state';
import { buildAlertFromResponse } from '../../utils/alert';

const project = (state = initialState, action) => {
  switch(action.type) {
    // Project
    case constants.PROJECT_FETCH_REQUEST:
      return {
        ...state,
        errors: [],
        isFetching: true
      };

    case constants.PROJECT_FETCH_SUCCESS:
      return {
        ...state,
        errors: [],
        item: action.project,
        isFetching: false
      };

    case constants.PROJECT_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false
      };

    // Project key
    case constants.PROJECT_UPDATE_KEY_REQUEST:
      return {
        ...state,
        isKeyUpdating: true,
      };

    case constants.PROJECT_UPDATE_KEY_SUCCESS:
      return {
        ...state,
        isKeyUpdating: false,
        item: {
          ...state.item,
          key: action.key,
        }
      };

    // Server connection test
    case constants.TEST_SERVER_CONNECTION_REQUEST:
      return {
        ...state,
        item: {
          ...state.item,
          servers: state.item.servers.map(server => {
            if (server.id === action.serverId) {
              return {
                ...server,
                connection_status: 2,
              }
            } else {
              return server;
            }
          })
        }
      };

    case constants.UPDATE_SERVER_CONNECTION_STATUS:
      return {
        ...state,
        item: {
          ...state.item,
          servers: state.item.servers.map(server => {
            if (server.id === action.serverId) {
              return {
                ...server,
                connection_status: action.connectionStatus,
              }
            } else {
              return server;
            }
          })
        }
      };

    // Server remove
    case constants.PROJECT_SERVER_REMOVE_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          servers: state.item.servers.filter(server => {
            return server.id !== action.serverId;
          })
        }
      };

    // Server update
    case constants.PROJECT_SERVER_UPDATE_REQUEST:
      return {
        ...state,
        errors: [],
        isUpdating: true,
        isUpdated: false,
      };

    case constants.PROJECT_SERVER_UPDATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isUpdating: false,
        isUpdated: true,
      };

    case constants.PROJECT_SERVER_UPDATE_FAILURE:
      return {
        ...state,
        errors: buildAlertFromResponse(action.errors),
        isUpdating: false,
        isUpdated: false,
      };

    // Server create
    case constants.PROJECT_SERVER_CREATE_REQUEST:
      return {
        ...state,
        errors: [],
        isCreating: true,
        isCreated: false,
      };

    case constants.PROJECT_SERVER_CREATE_SUCCESS:
      return {
        ...state,
        errors: [],
        isCreating: false,
        isCreated: true,
      };

    case constants.PROJECT_SERVER_CREATE_FAILURE:
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

export default project;
