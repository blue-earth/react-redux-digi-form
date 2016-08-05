import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RECEIVE_AUTH_STATUS = 'RECEIVE_AUTH_STATUS';

export const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
export const LOGGING_IN = 'LOGGING_IN';
export const LOGGED_IN = 'LOGGED_IN';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_IS_FETCHING_USER = 'SET_IS_FETCHING_USER';

export const INIT_AUTH_STATE = {
  authStatus: NOT_LOGGED_IN,
  user: {},
  isAuthenticating: false
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
// Action: requestAuth
// ------------------------------------
export const requestAuth = createAction(REQUEST_AUTH);

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
// Action: setUserProfile
// ------------------------------------
export const setUserProfile = createAction(SET_USER_PROFILE);

// ------------------------------------
// Reducer
// ------------------------------------
const authReducer = handleActions({
  REQUEST_AUTH: (state, action) =>
    Object.assign({}, state, {
      authStatus: LOGGING_IN
    }),
  RECEIVE_AUTH_STATUS: (state, action) =>
    Object.assign({}, state, {
      authStatus: action.payload ? LOGGED_IN : NOT_LOGGED_IN
    }),
  SET_USER_PROFILE: (state, action) =>
    Object.assign({}, state, {
      user: {...action.payload}
    }),
  SET_IS_FETCHING_USER: (state, action) =>
    Object.assign({}, state, {
      isAuthenticating: action.payload
    })
}, INIT_AUTH_STATE);

export default authReducer;
