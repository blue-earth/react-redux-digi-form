import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import { submitAnswer, FORM_USER_SUBMISSION, handleEnter, storeAnswer } from 'redux/modules/formInteractive';
import { show, hide } from 'redux-modal';
import { startSubmit, stopSubmit } from 'redux-form';

export const INIT_SIGNATURE_STATE = {
  isPageBusy: false,
  isCodeVerifyingModalOpen: false,
  email: '',
  name: '',
  isConsented: false,
  commitValue: ''
};

const OPEN_CODE_VERIFY = 'OPEN_CODE_VERIFY';
const CLOSE_CODE_VERIFY = 'CLOSE_CODE_VERIFY';
const REQUEST_VERIFY_EMAIL = 'REQUEST_VERIFY_EMAIL';
const DONE_VERIFYING_EMAIL = 'DONE_VERIFYING_EMAIL';
const CHANGE_EMAIL = 'CHANGE_EMAIL';
const CHANGE_NAME = 'CHANGE_NAME';
const CHANGE_CONSENTED = 'CHANGE_CONSENTED';
const CHANGE_COMMIT_VALUE = 'CHANGE_COMMIT_VALUE';

export const openCodeVerify = createAction(OPEN_CODE_VERIFY);
export const closeCodeVerify = createAction(CLOSE_CODE_VERIFY);
export const requestVerifyEmail = createAction(REQUEST_VERIFY_EMAIL);
export const doneVerifyingEmail = createAction(DONE_VERIFYING_EMAIL);

export const changeEmail = createAction(CHANGE_EMAIL);
export const changeName = createAction(CHANGE_NAME);
export const changeConsented = createAction(CHANGE_CONSENTED);
export const changeCommitValue = createAction(CHANGE_COMMIT_VALUE);

export const updateSessionId = () => {
  return (dispatch, getState) => {
    dispatch(submitAnswer(FORM_USER_SUBMISSION)); // Submit answer manually to update session ID
  };
};

export const closeVerificationModal = () => {
  return (dispatch, getState) => {
    dispatch(closeCodeVerify());
    dispatch(hide('signatureVerificationModal'));
  };
};

export const verifyEmail = () => {
  return (dispatch, getState) => {
    const { signatureVerification: { email }, formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(requestVerifyEmail());
    dispatch(processVerifyEmail(email, sessionId, id));
  };
};

const processVerifyEmail = (email, responseId, questionId) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/check_email/` +
    `?email=${email}&response_id=${responseId}`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneVerifyingEmail());
      if (value.is_verified) {
        dispatch(submitSignature(questionId));
      } else {
        dispatch(requestVerificationCode());
        dispatch(openCodeVerify());
        dispatch(show('signatureVerificationModal', {
          email
        }));
      }
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneVerifyingEmail());
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const requestVerificationCode = () => {
  return (dispatch, getState) => {
    const { signatureVerification: { email }, formInteractive: { sessionId } } = getState();
    dispatch(processRequestVerificationCode(email, sessionId));
  };
};
const processRequestVerificationCode = (email, sessionId) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/request_email_verification_code/`;
  const body = { email, response_id: sessionId };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const verifyEmailCode = (values) => {
  return (dispatch, getState) => {
    const { code } = values;
    const { signatureVerification: { email }, formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(startSubmit('signatureVerificationCode'));
    if (code) {
      dispatch(processVerifyEmailCode(email, sessionId, code, id));
    } else {
      dispatch(stopSubmit('signatureVerificationCode', {
        _error: 'Sorry, the code is empty.'
      }));
    }
  };
};
const processVerifyEmailCode = (email, sessionId, code, questionId) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/verify_email_code/`;
  const body = { email, response_id: sessionId, code };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      if (value.is_verified) {
        dispatch(closeVerificationModal());
        dispatch(submitSignature(questionId));
      } else {
        dispatch(stopSubmit('signatureVerificationCode', {_error: 'Sorry, the code is not correct!'}));
      }
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(stopSubmit('signatureVerificationCode', {_error: 'Sorry, there are errors '}));
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const submitSignature = (id) => {
  return (dispatch, getState) => {
    const {signatureVerification: {commitValue}} = getState();
    dispatch(storeAnswer({
      id,
      value: commitValue
    }));
    dispatch(handleEnter());
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const signatureReducer = handleActions({
  OPEN_CODE_VERIFY: (state, action) =>
    Object.assign({}, state, {
      isCodeVerifyingModalOpen: true
    }),
  CLOSE_CODE_VERIFY: (state, action) =>
    Object.assign({}, state, {
      isCodeVerifyingModalOpen: false
    }),
  REQUEST_VERIFY_EMAIL: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: true
    }),
  DONE_VERIFYING_EMAIL: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: false
    }),
  CHANGE_COMMIT_VALUE: (state, action) =>
    Object.assign({}, state, {
      commitValue: action.payload
    }),
  CHANGE_EMAIL: (state, action) =>
    Object.assign({}, state, {
      email: action.payload
    }),
  CHANGE_NAME: (state, action) =>
    Object.assign({}, state, {
      name: action.payload
    }),
  CHANGE_CONSENTED: (state, action) =>
    Object.assign({}, state, {
      isConsented: !state.isConsented
    })
}, INIT_SIGNATURE_STATE);

export default signatureReducer;
