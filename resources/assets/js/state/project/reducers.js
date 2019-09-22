import { initialState } from './state';

import {
  PROJECT_REQUEST,
  PROJECT_SUCCESS,
  PROJECT_FAILURE,
  PROJECT_UPDATE_KEY_SUCCESS,
  TEST_SERVER_CONNECTION_REQUEST,
  UPDATE_SERVER_CONNECTION_STATUS,
  PROJECT_SERVER_REMOVE_SUCCESS,
} from './constants';

const project = (state = initialState, action) => {
  switch(action.type) {
    case PROJECT_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case PROJECT_SUCCESS:
      return {
        item: action.project,
        isFetching: false
      };
    case PROJECT_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case PROJECT_UPDATE_KEY_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          key: action.key,
        }
      };
    case TEST_SERVER_CONNECTION_REQUEST:
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
    case UPDATE_SERVER_CONNECTION_STATUS:
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
    case PROJECT_SERVER_REMOVE_SUCCESS:
      return {
        ...state,
        item: {
          ...state.item,
          servers: state.item.servers.filter(server => {
            return server.id !== action.serverId;
          })
        }
      };

    default:
      return state;
  }
};

export default project;
