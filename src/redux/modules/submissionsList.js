import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';

export const RECEIVE_SUBMISSIONS = 'RECEIVE_SUBMISSIONS';
export const REQUEST_SUBMISSIONS = 'REQUEST_SUBMISSIONS';
export const DONE_FETCHING_SUBMISSIONS = 'DONE_FETCHING_SUBMISSIONS';

export const INIT_SUBMISSIONS_STATE = {
  id: 0,
  isFetching: false, // indicates the Submissions is being loaded.
  submissions: []
};

// ------------------------------------
// Action: processFetchSubmissions
// ------------------------------------
export const processFetchSubmissions = () => {
  var apiURL = `${API_URL}/form_document/api/form_response/`;

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveSubmissions(value));
      dispatch(doneFetchingSubmissions()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingSubmissions()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: requestSubmissions
// ------------------------------------
export const requestSubmissions = () => {
  return {
    type: REQUEST_SUBMISSIONS
  };
};

// ------------------------------------
// Action: receiveSubmissions
// ------------------------------------
export const receiveSubmissions = (data) => {
  return {
    type: RECEIVE_SUBMISSIONS,
    submissions: data
  };
};

// ------------------------------------
// Action: doneFetchingSubmissions
// ------------------------------------
export const doneFetchingSubmissions = () => {
  return {
    type: DONE_FETCHING_SUBMISSIONS
  };
};

// ------------------------------------
// Action: fetchSubmissions
// ------------------------------------
export const fetchSubmissions = (id) => {
  return (dispatch, getState) => {
    dispatch(requestSubmissions());
    dispatch(processFetchSubmissions());
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const submissionsReducer = (state = INIT_SUBMISSIONS_STATE, action) => {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, {
        submissions: action.submissions
      });
    case REQUEST_SUBMISSIONS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DONE_FETCHING_SUBMISSIONS:
      return Object.assign({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
};

export default submissionsReducer;
