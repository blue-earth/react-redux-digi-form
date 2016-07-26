import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const RECEIVE_FORM_PREVIEW = 'RECEIVE_FORM_PREVIEW';
export const REQUEST_FORM_PREVIEW = 'REQUEST_FORM_PREVIEW';
export const DONE_FETCHING_FORM_PREVIEW = 'DONE_FETCHING_FORM_PREVIEW';

export const RECEIVE_ANSWERS_PREVIEW = 'RECEIVE_ANSWERS_PREVIEW';
export const REQUEST_ANSWERS_PREVIEW = 'REQUEST_ANSWERS_PREVIEW';
export const DONE_FETCHING_ANSWERS_PREVIEW = 'DONE_FETCHING_ANSWERS_PREVIEW';

// ------------------------------------
// Form submit request action Constants
// ------------------------------------
export const FORM_USER_SUBMISSION = 'FORM_USER_SUBMISSION';
export const FORM_AUTOSAVE = 'FORM_AUTOSAVE';
export const UPDATE_ACCESS_CODE = 'UPDATE_ACCESS_CODE';

export const INIT_FORM_PREVIEW_STATE = {
  id: 0,
  // sessionId,
  isFetchingForm: false, // indicates the form request is being processed.
  isFetchingAnswers: false, // indicates the form answers are being fetched.
  lastUpdated: Date.now(), // last form-questions received time.
  form: {
    questions: [],
    logics: []
  }, // holds the received form data.
  title: 'Title',
  slug: 'slug',
  answers: [],
  formAccessStatus: 'init', // can be 'init', 'waiting', 'failed', 'success'
  isAccessCodeProtected: false,
  formAccessCode: ''
};

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id, accessCode) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/`;
  if (accessCode.length > 0) {
    apiURL += `?access_code=${accessCode}`;
  }
  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const submissionPreview = getState().submissionPreview;
      dispatch(receiveForm({
        id: id,
        form: value.form_data,
        title: value.title,
        slug: value.slug,
        lastUpdated: Date.now(),
        isAccessCodeProtected: value.is_access_code_protected,
        formAccessStatus: !value.form_data
          ? (submissionPreview.formAccessStatus === 'init' ? 'required' : 'fail')
          : 'success',
        sessionId: submissionPreview.sessionId
      }));
      dispatch(doneFetchingForm()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingForm()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: requestForm
// ------------------------------------
export const requestForm = createAction(REQUEST_FORM_PREVIEW);

// ------------------------------------
// Action: receiveForm
// ------------------------------------
export const receiveForm = createAction(RECEIVE_FORM_PREVIEW);

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = createAction(DONE_FETCHING_FORM_PREVIEW);

// ------------------------------------
// Action: fetchFormIfNeeded
// ------------------------------------
export const fetchFormIfNeeded = (id) => {
  return (dispatch, getState) => {
    if (shouldFetchForm(getState(), id)) {
      const submissionPreview = getState().submissionPreview;
      dispatch(requestForm());
      dispatch(fetchForm(id, submissionPreview.formAccessCode));
    } else {
      // dispatch(fetchAnswers());
    }
  };
};

// ------------------------------------
// Action: fetchAnswers
// ------------------------------------
export const fetchAnswers = (sessionId) => {
  return (dispatch, getState) => {
    dispatch(requestAnswers());
    dispatch(processFetchAnswers(sessionId));
  };
};

// ------------------------------------
// Action: requestAnswers
// ------------------------------------
export const requestAnswers = createAction(REQUEST_ANSWERS_PREVIEW);

// ------------------------------------
// Action: receiveAnswers
// ------------------------------------
export const receiveAnswers = createAction(RECEIVE_ANSWERS_PREVIEW);

// ------------------------------------
// Action: doneFetchingAnswers
// ------------------------------------
export const doneFetchingAnswers = createAction(DONE_FETCHING_ANSWERS_PREVIEW);

// ------------------------------------
// Helper Action: processFetchAnswers
// ------------------------------------
export const processFetchAnswers = (sessionId) => {
  const apiURL = `${API_URL}/form_document/api/form_response/${sessionId}/`;
  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveAnswers({
        sessionId: value.response_id,
        answers: value.answers
      }));
      dispatch(doneFetchingAnswers()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingAnswers()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: updateAccessCode
// ------------------------------------
export const updateAccessCode = createAction(UPDATE_ACCESS_CODE);

// ------------------------------------
// Helper: shouldFetchForm
// ------------------------------------
const shouldFetchForm = (state, id) => {
  const submissionPreview = state.submissionPreview;
  /*
   * We should fetch form if
   * - no form_data has loaded
   * - it should load another form
   * - if form is not being loaded
   */
  if ((id !== submissionPreview.id || !submissionPreview.form) &&
  !submissionPreview.isFetchingForm) {
    return true;
  } else {
    return false;
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const submissionPreviewReducer = handleActions({
  RECEIVE_FORM_PREVIEW: (state, action) =>
    Object.assign({}, state, action.payload),

  REQUEST_FORM_PREVIEW: (state, action) =>
    Object.assign({}, state, {
      isFetchingForm: true,
      formAccessStatus: 'waiting'
    }),

  DONE_FETCHING_FORM_PREVIEW: (state, action) =>
    Object.assign({}, state, {
      isFetchingForm: false
    }),

  REQUEST_ANSWERS_PREVIEW: (state, action) =>
    Object.assign({}, state, {
      isFetchingAnswers: true
    }),

  RECEIVE_ANSWERS_PREVIEW: (state, action) =>
    Object.assign({}, state, action.payload),

  DONE_FETCHING_ANSWERS_PREVIEW: (state, action) =>
    Object.assign({}, state, {
      isFetchingAnswers: false
    }),

  UPDATE_ACCESS_CODE: (state, action) =>
    Object.assign({}, state, {
      formAccessCode: action.payload
    })

}, INIT_FORM_PREVIEW_STATE);

export default submissionPreviewReducer;
