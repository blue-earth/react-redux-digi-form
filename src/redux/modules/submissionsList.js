import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';

export const RECEIVE_SUBMISSIONS = 'RECEIVE_SUBMISSIONS';
export const REQUEST_SUBMISSIONS = 'REQUEST_SUBMISSIONS';
export const DONE_FETCHING_SUBMISSIONS = 'DONE_FETCHING_SUBMISSIONS';

export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';

export const INIT_SUBMISSIONS_STATE = {
  id: 0,
  isFetching: false, // indicates the Submissions is being loaded.
  submissions: [],
  currentPage: 0, // indicates the current page number submission table page.
  pageSize: 10, // indicates number of items per page.
  totalCount: 0 // indicates total number of submission items available on server.
};

// ------------------------------------
// Action: processFetchSubmissions
// ------------------------------------
export const processFetchSubmissions = (page) => {
  var apiURL = `${API_URL}/form_document/api/form_response/`;

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveSubmissions(value, page));
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
export const receiveSubmissions = (data, page) => {
  return {
    type: RECEIVE_SUBMISSIONS,
    submissions: data,
    page,
    totalCount: data.length // TODO: need accurate api.
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
export const fetchSubmissions = (page) => {
  return (dispatch, getState) => {
    dispatch(requestSubmissions());
    dispatch(processFetchSubmissions(page));
  };
};

// ------------------------------------
// Action: setPageSize
// ------------------------------------
export const setPageSize = (size) => {
  return {
    type: SET_PAGE_SIZE,
    page: 0,
    pageSize: size
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const submissionsReducer = (state = INIT_SUBMISSIONS_STATE, action) => {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, {
        submissions: action.submissions,
        currentPage: action.page,
        totalCount: action.totalCount
      });
    case REQUEST_SUBMISSIONS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DONE_FETCHING_SUBMISSIONS:
      return Object.assign({}, state, {
        isFetching: false
      });
    case SET_PAGE_SIZE:
      return Object.assign({}, state, {
        currentPage: action.page,
        pageSize: action.pageSize
      });
    default:
      return state;
  }
};

export default submissionsReducer;
