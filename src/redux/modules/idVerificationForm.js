import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { createAction, handleActions } from 'redux-actions';
import { assignDefaults } from 'redux/utils/request';
import { identityConstants } from 'schemas/idVerificationFormSchema';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const REQUEST_ID_SUBMIT = 'REQUEST_ID_SUBMIT';
export const DONE_ID_SUBMIT = 'DONE_ID_SUBMIT';
export const REQUEST_ID_FILE_UPLOAD = 'REQUEST_ID_FILE_UPLOAD';
export const DONE_ID_FILE_UPLOAD = 'DONE_ID_FILE_UPLOAD';

export const IDENTITY_VERIFICATION_URL = `${API_URL}/identity-verification/api/identity/`;
export const IDENTITY_ATTACHMENT_URL = `${API_URL}/identity-verification/api/identity-attachment/`;

export const SET_ID_TYPE = 'SET_ID_TYPE';

export const INIT_ID_FORM_STATE = {
  isSubmitting: false,
  isUploading: false,
  idType: identityConstants.DVSPASSPORT
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
// Action: requestUploadIdFile
// ------------------------------------
export const requestUploadIdFile = createAction(REQUEST_ID_FILE_UPLOAD);

// ------------------------------------
// Action: doneUploadIdFile
// ------------------------------------
export const doneUploadIdFile = createAction(DONE_ID_FILE_UPLOAD);

// ------------------------------------
// Action: setIdType
// ------------------------------------
export const setIdType = createAction(SET_ID_TYPE);

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
// Reducer
// ------------------------------------
const idVerificationFormReducer = handleActions({
  REQUEST_ID_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: true
    }),

  DONE_ID_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: false
    }),

  REQUEST_ID_FILE_UPLOAD: (state, action) =>
    Object.assign({}, state, {
      isUploading: true
    }),

  DONE_ID_FILE_UPLOAD: (state, action) =>
    Object.assign({}, state, {
      isUploading: false
    }),

  SET_ID_TYPE: (state, { payload }) =>
    Object.assign({}, state, {
      idType: payload
    })

}, INIT_ID_FORM_STATE);

export default idVerificationFormReducer;
