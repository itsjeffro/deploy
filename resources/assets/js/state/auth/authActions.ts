import * as constants from './authConstants';
import AuthApi from "../../services/Api/AuthApi";

export const fetchMeSuccess = (user) =>({
  type: constants.FETCH_ME_SUCCESS,
  user: user,
});

export const fetchMe = () => {
  return (dispatch) => {
    const authApi = new AuthApi();

    authApi.user()
      .then((response) => {
        dispatch(fetchMeSuccess(response.data));
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
};
