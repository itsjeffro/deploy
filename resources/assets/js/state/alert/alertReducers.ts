import { TOAST_ADD, TOAST_REMOVE } from './alertConstants';

const initialState = {
  toasts: [],
};

const alert = (state = initialState, action) => {
  const { payload, type } = action;

  switch(type) {
    case TOAST_ADD:
      return {
        toasts: [
          payload,
          ...state.toasts,
        ]
      };

    case TOAST_REMOVE:
      return {
        toasts: state.toasts.filter((toast) => toast.id !== payload.id)
      };

    default:
      return state;
  }
};

export default alert;
