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
  isCreated: false,
  isDeleting: false,
  isUpdating: false,
  isFetching: false,
  itemsById: {},
  items: []
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
        isFetching: false,
        itemsById: action.projects.reduce((items, project) => {
          items[project.id] = project;
          return items;
        }, {}),
        items: action.projects.map(project => {
          return project.id;
        })
      };

    case PROJECTS_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
        items: state.items.concat(action.project)
      };

    case PROJECTS_CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        items: state.items.concat(action.project),
        itemsById: state.items.concat({[action.project.id]: action.project})
      };
      
    case PROJECTS_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true
      };
      
    case PROJECTS_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        itemsById: Object.key(state.itemsById).map(key => {
          return action.project.id === key ? action.project : state.itemsById[key]
        })
      };

    case PROJECTS_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true
      };
      
    case PROJECTS_DELETE_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        items: state.items.filter(item => {
          return item !== action.project_id;
        })
      };

    default:
      return state;
  }
};

export default projects;