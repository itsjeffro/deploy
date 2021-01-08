import { TOAST_ADD, TOAST_REMOVE } from './alertConstants';

let id = 0;

export const toastAdd = (message) =>({
  type: TOAST_ADD,
  payload: {
    id: id++,
    message: message,
  }
});

export const toastRemove = (id) =>({
  type: TOAST_REMOVE,
  payload: {
    id: id,
  }
});

export const createToast = (message) => {
  return (dispatch) => {
    const toastId = id;

    dispatch(toastAdd(message));

    setTimeout(() => {
      dispatch(toastRemove(toastId));
    }, 3000);
  };
};
