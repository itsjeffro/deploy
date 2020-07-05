import { 
  FETCH_ACCOUNT_PROVIDERS_FAILURE, 
  FETCH_ACCOUNT_PROVIDERS_REQUEST, 
  FETCH_ACCOUNT_PROVIDERS_SUCCESS,
} from './constants';

const initialState = {
  errors: [],
  isFetching: false,
  items: [],
};

const reducers = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_ACCOUNT_PROVIDERS_REQUEST:
      return {
        ...state,
        isFetching: true
      };

    case FETCH_ACCOUNT_PROVIDERS_SUCCESS:
      return {
        ...state,
        errors: [],
        isFetching: false,
        items: action.providers,
      };

      case FETCH_ACCOUNT_PROVIDERS_FAILURE:
        return {
          ...state,
          errors: [],
          isFetching: false,
          items: []
        };

    default:
      return state;
  }
};

export default reducers;
