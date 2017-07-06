import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction, handleActions } from 'redux-actions';
import { assignDefaults } from 'redux/utils/request';
import _ from 'lodash';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const REQUEST_ID_SUBMIT = 'REQUEST_ID_SUBMIT';
export const DONE_ID_SUBMIT = 'DONE_ID_SUBMIT';
export const ADD_ATTACHMENT = 'ADD_ATTACHMENT';
export const REMOVE_ATTACHMENT = 'REMOVE_ATTACHMENT';

export const IDENTITY_VERIFICATION_URL = `${API_URL}/identity-verification/api/identity/`;
export const IDENTITY_ATTACHMENT_URL = `${API_URL}/identity-verification/api/identity-attachment/`;
export const INIT_IDENTITY_STATE = {
  isSubmitting: false,
  attachments: []
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
      typeof payload.success === 'function' && payload.success(value);
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
// Action: addAttachment
// ------------------------------------
export const addAttachment = createAction(ADD_ATTACHMENT);

// ------------------------------------
// Action: removeAttachment
// ------------------------------------
export const removeAttachment = createAction(REMOVE_ATTACHMENT);

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
    }),

  ADD_ATTACHMENT: (state, action) =>
    Object.assign({}, state, {
      attachments: _.union(state.attachments, [action.payload])
    }),

  REMOVE_ATTACHMENT: (state, { payload }) =>
    Object.assign({}, state, {
      attachments: payload ? _.without(state.attachments, payload) : []
    })

}, INIT_IDENTITY_STATE);

export default identityVerificationReducer;
