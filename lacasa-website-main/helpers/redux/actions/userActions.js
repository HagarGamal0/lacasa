import axios from "axios";
import store from "../store";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCESS,
  USER_SIGNOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCESS,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_SUCESS,
  USER_FROGET_EMAIL_REQUEST,
  USER_FROGET_EMAIL_SUCESS,
  USER_FROGET_EMAIL_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCESS,
  USER_RESET_PASSWORD_FAIL,
} from "../constants/userConstants";

export const registerAction =
  (data, type, email, password) => async (dispatch) => {
    dispatch({
      type: USER_REGISTER_REQUEST,
      payload: { data },
    });
    try {
      const user = await axios.post(
        `${process.env.NEXT_APP_BASE_URL}/${type}`,
        data
      );
      if (user) {
        if (type === "vendors") {
          await dispatch(signin(email, password));
        } else {
          await dispatch(signin(data.email, data.password));
        }
        await dispatch({ type: USER_REGISTER_SUCESS, payload: user });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response.data,
      });
    }
  };

export const signin = (email, password) => async (dispatch) => {
  dispatch({
    type: USER_SIGNIN_REQUEST,
    payload: { email, password },
  });
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_APP_BASE_URL}/authenticate`,
      { email, password }
    );
    if (data) {
      dispatch({ type: USER_SIGNIN_SUCESS, payload: data });
      localStorage.removeItem("addresses");
      localStorage.setItem("userInfo", data.data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data));

      if (data.data.user.type === "Vendor")
        localStorage.setItem("isVendor", "true");
      else localStorage.setItem("isVendor", "false");

      return data ? data : false;
    } else {
      dispatch({
        type: USER_SIGNIN_FAIL,
        payload: false,
      });
      return false;
    }
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload: error.response.data,
    });
  }
};

export const signout = () => async (dispatch) => {
  await localStorage.removeItem("userInfo");
  await localStorage.removeItem("user");
  await dispatch({ type: USER_SIGNOUT, payload: false });
  return true;
};

export const userForgetEmail = (email) => async (dispatch) => {
  dispatch({
    type: USER_FROGET_EMAIL_REQUEST,
    payload: { email },
  });
  try {
    const user = await axios.post(`${process.env.NEXT_APP_BASE_URL}/reset`, {
      email,
    });
    if (user) {
      dispatch({ type: USER_FROGET_EMAIL_SUCESS, payload: user });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    dispatch({
      type: USER_FROGET_EMAIL_FAIL,
      payload: error,
    });
  }
};

export const userResetPassword =
  (reset_token, password, password_confirmation) => async (dispatch) => {
    dispatch({
      type: USER_RESET_PASSWORD_REQUEST,
      payload: { reset_token, password, password_confirmation },
    });
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_APP_BASE_URL}/reset`,
        { reset_token, password, password_confirmation }
      );
      if (data) {
        dispatch({ type: USER_RESET_PASSWORD_SUCESS, payload: data });
        localStorage.setItem("userInfo", data.data.access_token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch({
        type: USER_RESET_PASSWORD_FAIL,
        payload: error,
      });
    }
  };

export const detailsUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: user });

  const userInfo = localStorage.getItem("userInfo");
  try {
    const AuthAxios = axios.create({
      headers: {
        Authorization: `Bearer ${userInfo}`,
      },
    });
    const { data } = await AuthAxios.get(
      `${process.env.NEXT_APP_BASE_URL}/profile`
    );
    await dispatch({ type: USER_DETAILS_SUCESS, payload: data });
  } catch (error) {
    localStorage.removeItem("userInfo");
    const message = error.response;
    dispatch({ type: USER_REGISTER_FAIL, payload: message });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const userInfo = localStorage.getItem("userInfo");
  try {
    const authAxios = axios.create({
      headers: {
        Authorization: `Bearer ${userInfo}`,
      },
    });
    const { data } = await authAxios.post(
      `${process.env.NEXT_APP_BASE_URL}/profile`,
      user
    );
    if (data) {
      await dispatch({ type: USER_UPDATE_PROFILE_SUCESS, payload: data });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    const message = error.response.data;
    dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: message });
  }
};
