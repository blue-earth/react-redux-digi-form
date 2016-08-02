import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RECEIVE_AUTH_STATUS = 'RECEIVE_AUTH_STATUS';

export const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
export const LOGGING_IN = 'LOGGING_IN';
export const LOGGED_IN = 'LOGGED_IN';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const INIT_AUTH_STATE = {
  authStatus: NOT_LOGGED_IN
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
export const requestAuth = () => {
  return {
    type: REQUEST_AUTH
  };
};

// ------------------------------------
// Action: processAuth
// ------------------------------------
export const processAuth = (email, password) => {
  const body = {
    email: email,
    password: password
  };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveAuthStatus(value));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(receiveAuthStatus({authenticated: false})); // Hide loading spinner
    };
  };

  return bind(fetch(`${API_URL}/accounts/api/auth/login/`, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: fetchUserInfo
// ------------------------------------
export const fetchUserInfo = () => {
  const fetchParams = assignDefaults({
    method: 'GET'
  });

  const fetchSuccess = (data) => {
    return (dispatch, getState) => {
      dispatch(setUserProfile(data));
    };
  };

  return bind(fetch(`${API_URL}/accounts/api/user/`, fetchParams), fetchSuccess);
};

// ------------------------------------
// Action: doneAuth
// ------------------------------------
export const receiveAuthStatus = (value) => {
  return {
    type: RECEIVE_AUTH_STATUS,
    status: value.authenticated
  };
};

export const setUserProfile = (profileDictionary) => {
  return {
    type: SET_USER_PROFILE,
    data: profileDictionary
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const authReducer = (state = INIT_AUTH_STATE, action) => {
  switch (action.type) {
    case REQUEST_AUTH:
      return Object.assign({}, state, {
        authStatus: LOGGING_IN
      });
    case RECEIVE_AUTH_STATUS:
      return Object.assign({}, state, {
        authStatus: action.status ? LOGGED_IN : NOT_LOGGED_IN
      });
    case SET_USER_PROFILE:
      return Object.assign({}, state, {
        user: {...action.data}
      });
    default:
      return state;
  }
};

export default authReducer;
