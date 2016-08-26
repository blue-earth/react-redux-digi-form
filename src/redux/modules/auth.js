import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RECEIVE_AUTH_STATUS = 'RECEIVE_AUTH_STATUS';

export const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
export const LOGGING_IN = 'LOGGING_IN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED_OUT = 'LOGGED_OUT';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_IS_FETCHING_USER = 'SET_IS_FETCHING_USER';

export const LOGOUT = 'LOGOUT';

// TODO: decide if signup stuff should be here or in it's own module
export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const RECEIVE_SIGNUP_STATUS = 'RECEIVE_SIGNUP_STATUS';

export const SIGNING_UP = 'SIGNING_UP';
// export const SIGNED_UP = 'SIGNED_UP';

export const INIT_AUTH_STATE = {
  authStatus: NOT_LOGGED_IN,
  user: {},
  isAuthenticating: false,
  signUpEmailSent: false
};

// ------------------------------------
// Action: submitLoginForm
// ------------------------------------
export const submitLoginForm = (email, password) => {
  return (dispatch, getState) => {
    dispatch(requestAuth());
    dispatch(processAuth(email, password));
  };
};

// ------------------------------------
// Action: submitSignupForm
// ------------------------------------
export const submitSignupForm = (email, password) => {
  return (dispatch, getState) => {
    dispatch(requestSignup());
    dispatch(processSignup(email, password));
  };
};

// ------------------------------------
// Action: requestAuth
// ------------------------------------
export const requestAuth = createAction(REQUEST_AUTH);

// ------------------------------------
// Action: requestSignup
// ------------------------------------
export const requestSignup = createAction(REQUEST_SIGNUP);

// ------------------------------------
// Action: processAuth
// ------------------------------------
export const processAuth = (email, password) => {
  const apiURL = `${API_URL}/accounts/api/auth/login/`;
  const body = { email, password };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveAuthStatus(value.authenticated));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(receiveAuthStatus(false)); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: processSignup
// ------------------------------------
export const processSignup = (email, password) => {
  const apiURL = `${API_URL}/accounts/api/auth/signup/`;
  const body = { email, password };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveSignUpStatus(value.emailSent));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(receiveSignUpStatus(false));
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: setIsFetchingUserInfo
// ------------------------------------
export const setIsFetchingUserInfo = createAction(SET_IS_FETCHING_USER);

// ------------------------------------
// Action: fetchUserInfo
// ------------------------------------
export const fetchUserInfo = () => {
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(setUserProfile(value));
      dispatch(setIsFetchingUserInfo(false));
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(setIsFetchingUserInfo(false));
    };
  };
  return [
    setIsFetchingUserInfo(true),
    bind(fetch(`${API_URL}/accounts/api/user/`, fetchParams), fetchSuccess, fetchFail)
  ];
};

// ------------------------------------
// Action: doneAuth
// ------------------------------------
export const receiveAuthStatus = createAction(RECEIVE_AUTH_STATUS);

// ------------------------------------
// Action: sign up submitted
// ------------------------------------
export const receiveSignUpStatus = createAction(RECEIVE_SIGNUP_STATUS);

// ------------------------------------
// Action: setUserProfile
// ------------------------------------
export const setUserProfile = createAction(SET_USER_PROFILE);

// ------------------------------------
// Action: handleLogout
// ------------------------------------
export const handleLogout = () => {
  return (dispatch, getState) => {
    dispatch(logout());
  };
};

// ------------------------------------
// Action: logout
// ------------------------------------
// TODO: does logout functionality need to happen on the backend?
// TODO: does the state need to show logout, or can it just be reset to INIT_AUTH_STATE
export const logout = createAction(LOGOUT);

// ------------------------------------
// Reducer
// ------------------------------------
const authReducer = handleActions({
  REQUEST_AUTH: (state, action) =>
    Object.assign({}, state, {
      authStatus: LOGGING_IN
    }),
  REQUEST_SIGNUP: (state, action) =>
    Object.assign({}, state, {
      authStatus: SIGNING_UP
    }),
  RECEIVE_AUTH_STATUS: (state, action) =>
    Object.assign({}, state, {
      authStatus: action.payload ? LOGGED_IN : NOT_LOGGED_IN
    }),
  RECEIVE_SIGNUP_STATUS: (state, action) =>
    Object.assign({}, state, {
      signUpEmailSent: action.payload
    }),
  SET_USER_PROFILE: (state, action) =>
    Object.assign({}, state, {
      user: {...action.payload}
    }),
  SET_IS_FETCHING_USER: (state, action) =>
    Object.assign({}, state, {
      isAuthenticating: action.payload
    }),
  LOGOUT: (state, action) =>
    Object.assign({}, state, {
      authStatus: LOGGED_OUT
    })
}, INIT_AUTH_STATE);

export default authReducer;
