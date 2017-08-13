import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import { submitAnswer, FORM_USER_SUBMISSION, handleEnter, storeAnswer } from 'redux/modules/formInteractive';
import { show, hide } from 'redux-modal';

export const INIT_SIGNATURE_STATE = {
  isPageBusy: false,
  isVerifyingCode: false,
  isCodeVerified: true,
  email: ''
};

const OPEN_CODE_VERIFY = 'OPEN_CODE_VERIFY';
const CLOSE_CODE_VERIFY = 'CLOSE_CODE_VERIFY';
const REQUEST_VERIFY_EMAIL = 'REQUEST_VERIFY_EMAIL';
const DONE_VERIFYING_EMAIL = 'DONE_VERIFYING_EMAIL';
const IS_CODE_VERIFIED = 'IS_CODE_VERIFIED';
const CHANGE_EMAIL = 'CHANGE_EMAIL';

export const openCodeVerify = createAction(OPEN_CODE_VERIFY);
export const closeCodeVerify = createAction(CLOSE_CODE_VERIFY);
export const requestVerifyEmail = createAction(REQUEST_VERIFY_EMAIL);
export const doneVerifyingEmail = createAction(DONE_VERIFYING_EMAIL);
export const isEmailCodeVerified = createAction(IS_CODE_VERIFIED);

export const changeEmail = createAction(CHANGE_EMAIL);

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

export const verifyEmail = (signatureValue) => {
  return (dispatch, getState) => {
    const { signatureVerification: { email }, formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(requestVerifyEmail());
    dispatch(processVerifyEmail(email, sessionId, id, signatureValue));
  };
};

export const resetVerifyErrorMessage = () => {
  return (dispatch, getState) => {
    dispatch(isEmailCodeVerified(true));
  };
};

const processVerifyEmail = (email, responseId, questionId, signatureValue) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/check_email/` +
    `?email=${email}&response_id=${responseId}`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneVerifyingEmail());
      if (value.is_verified) {
        dispatch(submitSignature(questionId, signatureValue));
      } else {
        dispatch(requestVerificationCode());
        dispatch(openCodeVerify());
        dispatch(show('signatureVerificationModal', {
          signatureValue,
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

export const verifyEmailCode = (code, value) => {
  return (dispatch, getState) => {
    const { signatureVerification: { email }, formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(processVerifyEmailCode(email, sessionId, code, id, value));
  };
};
const processVerifyEmailCode = (email, sessionId, code, questionId, signatureValue) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/verify_email_code/`;
  const body = { email, response_id: sessionId, code };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      if (value.is_verified) {
        dispatch(isEmailCodeVerified(true));
        dispatch(closeVerificationModal());
        dispatch(submitSignature(questionId, signatureValue));
      } else {
        dispatch(isEmailCodeVerified(false));
      }
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const submitSignature = (id, value) => {
  return (dispatch, getState) => {
    dispatch(storeAnswer({id, value}));
    dispatch(handleEnter());
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const signatureReducer = handleActions({
  OPEN_CODE_VERIFY: (state, action) =>
    Object.assign({}, state, {
      isVerifyingCode: true
    }),
  CLOSE_CODE_VERIFY: (state, action) =>
    Object.assign({}, state, {
      isVerifyingCode: false
    }),
  REQUEST_VERIFY_EMAIL: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: true
    }),
  DONE_VERIFYING_EMAIL: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: false
    }),
  IS_CODE_VERIFIED: (state, action) =>
    Object.assign({}, state, {
      isCodeVerified: action.payload
    }),
  CHANGE_EMAIL: (state, action) =>
    Object.assign({}, state, {
      email: action.payload
    })
}, INIT_SIGNATURE_STATE);

export default signatureReducer;
