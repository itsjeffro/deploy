import {
  ALERT_SHOW,
  ALERT_HIDE
} from './alertConstants';

const initialState = {
  alert: {
    message: '',
    show: false
  }
};

const alert = (state = initialState, action) => {
  switch(action.type) {
    case ALERT_SHOW:
    case ALERT_HIDE:
      return {
        alert: {
          message: action.message,
          show: action.show
        }
      };

    default:
      return state;
  }
};

export default alert;
