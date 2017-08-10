import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import { submitAnswer, FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';

export const INIT_SIGNATURE_STATE = {
  isPageBusy: false,
  email: '',
  emailList: ['liu@emondo.com.au', 'test@email.com']
};

const RECEIVE_EMAIL_LIST = 'RECEIVE_EMAIL_LIST';
const REQUEST_FETCH_EMAIL_LIST = 'REQUEST_FETCH_EMAIL_LIST';
const DONE_FETCHING_EMAIL_LIST = 'DONE_FETCHING_EMAIL_LIST';
const CHANGE_EMAIL = 'CHANGE_EMAIL';

export const receiveEmailList = createAction(RECEIVE_EMAIL_LIST);
export const requestFetchEmailList = createAction(REQUEST_FETCH_EMAIL_LIST);
export const doneFetchingEmailList = createAction(DONE_FETCHING_EMAIL_LIST);

export const changeEmail = createAction(CHANGE_EMAIL);

export const fetchEmailList = () => {
  return (dispatch, getState) => {
    dispatch(requestFetchEmailList());
    dispatch(processFetchEmailList());
    dispatch(submitAnswer(FORM_USER_SUBMISSION)); // Submit answer manually to update session ID
  };
};

const processFetchEmailList = () => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveEmailList(value));
      dispatch(doneFetchingEmailList());
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingEmailList());
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
  const apiUrl = `${API_URL}/form_document/api/signing_verification/request_verification/`;
  const body = { email };
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

export const verifyEmailCode = (code, success) => {
  return (dispatch, getState) => {
    const { signatureVerification: { email }, formInteractive: { sessionId } } = getState();
    // Replaced mockup function
    if (code === '1234') {
      setTimeout(() => { success(); }, 1000);
    }
    // dispatch(processVerifyEmailCode(email, sessionId, code));
  };
};
const processVerifyEmailCode = (email, sessionId, code) => {
  const apiUrl = `${API_URL}/form_document/api/signing_verification/verify_email_code/`;
  const body = { email, sessionId, code };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(fetchEmailList());
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };
  return bind(fetch(apiUrl, fetchParams), fetchSuccess, fetchFail);
};

export const submitSignature = (signatureValue) => {
  return (dispatch, getState) => {
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const signatureReducer = handleActions({
  REQUEST_FETCH_EMAIL_LIST: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: true
    }),
  DONE_FETCHING_EMAIL_LIST: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: false
    }),
  RECEIVE_EMAIL_LIST: (state, action) =>
    Object.assign({}, state, {
      emailList: action.payload
    }),
  CHANGE_EMAIL: (state, action) =>
    Object.assign({}, state, {
      email: action.payload
    })
}, INIT_SIGNATURE_STATE);

export default signatureReducer;
