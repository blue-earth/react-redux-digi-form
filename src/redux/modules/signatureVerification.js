import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import { submitAnswer, FORM_USER_SUBMISSION, handleEnter, storeAnswer } from 'redux/modules/formInteractive';
import { show, hide } from 'redux-modal';

export const INIT_SIGNATURE_STATE = {
  isPageBusy: false,
  isCodeVerifyingModalOpen: false,
  isCodeVerified: true,
  commitValue: {}
};

const OPEN_CODE_VERIFY = 'OPEN_CODE_VERIFY';
const CLOSE_CODE_VERIFY = 'CLOSE_CODE_VERIFY';
const REQUEST_VERIFY_EMAIL = 'REQUEST_VERIFY_EMAIL';
const DONE_VERIFYING_EMAIL = 'DONE_VERIFYING_EMAIL';
const IS_CODE_VERIFIED = 'IS_CODE_VERIFIED';
const RESET_CODE_VERIFIED = 'RESET_CODE_VERIFIED';

export const openCodeVerify = createAction(OPEN_CODE_VERIFY);
export const closeCodeVerify = createAction(CLOSE_CODE_VERIFY);
export const requestVerifyEmail = createAction(REQUEST_VERIFY_EMAIL);
export const doneVerifyingEmail = createAction(DONE_VERIFYING_EMAIL);

export const isCodeVerified = createAction(IS_CODE_VERIFIED);
export const resetCodeVerified = createAction(RESET_CODE_VERIFIED);

export const updateSessionId = () => {
  return (dispatch, getState) => {
    dispatch(submitAnswer(FORM_USER_SUBMISSION)); // Submit answer manually to update session ID
  };
};

export const closeVerificationModal = () => {
  return (dispatch, getState) => {
    dispatch(resetCodeVerified());
    dispatch(closeCodeVerify());
    dispatch(hide('signatureVerificationModal'));
  };
};

export const submitValue = (values) => {
  return (dispatch, getState) => {
    const { formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(requestVerifyEmail());
    dispatch(processVerifyEmail(values, sessionId, id));
  };
};

const processVerifyEmail = (commitValue, responseId, questionId) => {
  const { email } = commitValue;
  const apiUrl = `${API_URL}/form_document/api/signing_verification/check_email/` +
    `?email=${email}&response_id=${responseId}`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneVerifyingEmail());
      if (value.is_verified) {
        dispatch(submitSignature(questionId, commitValue));
      } else {
        dispatch(requestVerificationCode(commitValue));
        dispatch(openCodeVerify());
        dispatch(show('signatureVerificationModal', {
          commitValue
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

export const requestVerificationCode = (values) => {
  return (dispatch, getState) => {
    const { email, name } = values;
    const { formInteractive: { sessionId } } = getState();
    dispatch(processRequestVerificationCode(email, sessionId, name));
  };
};
const processRequestVerificationCode = (email, sessionId, name) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/request_email_verification_code/`;
  const body = { email, response_id: sessionId, display_name: name };
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

export const verifyEmailCode = (commitValue) => {
  const { code } = commitValue;
  return (dispatch, getState) => {
    if (code.length === 0) {
      return dispatch(isCodeVerified(false));
    }
    const { formInteractive: { sessionId, currentQuestion: { id } } } = getState();
    dispatch(processVerifyEmailCode(commitValue, sessionId, id));
  };
};
const processVerifyEmailCode = (commitValue, sessionId, questionId) => {
  const {code, email} = commitValue;
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
        dispatch(isCodeVerified(true));
        dispatch(submitSignature(questionId, commitValue));
      } else {
        dispatch(isCodeVerified(false));
      }
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const submitSignature = (id, commitValue) => {
  return (dispatch, getState) => {
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
  IS_CODE_VERIFIED: (state, action) =>
    Object.assign({}, state, {
      isCodeVerified: action.payload
    }),
  RESET_CODE_VERIFIED: (state, action) =>
    Object.assign({}, state, {
      isCodeVerified: true
    })
}, INIT_SIGNATURE_STATE);

export default signatureReducer;
