import * as constants from './authConstants';

const initialState = {
  user: null,
};

const authReducers = (state = initialState, action) => {
  switch(action.type) {
    case constants.FETCH_ME_SUCCESS:
      return {
        ...state,
        user: action.user
      };

    default:
      return state;
  }
};

export default authReducers;
