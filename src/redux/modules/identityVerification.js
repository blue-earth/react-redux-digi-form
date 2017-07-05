import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction, handleActions } from 'redux-actions';
import { assignDefaults } from 'redux/utils/request';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const REQUEST_ID_SUBMIT = 'REQUEST_ID_SUBMIT';
export const DONE_ID_SUBMIT = 'DONE_ID_SUBMIT';

export const IDENTITY_VERIFICATION_URL = `${API_URL}/identity-verification/api/identity/`;

export const INIT_IDENTITY_STATE = {
  isSubmitting: false
};

// ------------------------------------
// Action: submitIdentity
// ------------------------------------
export const submitIdentity = (payload) => {
  return (dispatch, getState) => {
    dispatch(requestSubmitIdentity());
    dispatch(processSubmitIdentity(payload));
  };
};

// ------------------------------------
// Action: requestSubmitIdentity
// ------------------------------------
export const requestSubmitIdentity = createAction(REQUEST_ID_SUBMIT);

// ------------------------------------
// Action: doneSubmitIdentity
// ------------------------------------
export const doneSubmitIdentity = createAction(DONE_ID_SUBMIT);

// ------------------------------------
// Action Helper: processSubmitIdentity
// ------------------------------------
export const processSubmitIdentity = (payload) => {
  var method = 'POST';
  var requestURL = IDENTITY_VERIFICATION_URL;

  const fetchParams = assignDefaults({
    method,
    body: payload.body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitIdentity()); // Hide submitting spinner
      typeof payload.success === 'function' && payload.success();
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitIdentity()); // Hide submitting spinner
      typeof payload.fail === 'function' && payload.fail();
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Reducer
// ------------------------------------
const identityVerificationReducer = handleActions({
  REQUEST_ID_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: true
    }),

  DONE_ID_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: false
    })

}, INIT_IDENTITY_STATE);

export default identityVerificationReducer;
