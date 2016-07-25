import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
import { getPageQueryParamsObject } from 'helpers/pageListingHelpers';
import { createAction } from 'redux-actions';
import _ from 'lodash';

export const RECEIVE_SUBMISSIONS = 'RECEIVE_SUBMISSIONS';
export const REQUEST_SUBMISSIONS = 'REQUEST_SUBMISSIONS';
export const DONE_FETCHING_SUBMISSIONS = 'DONE_FETCHING_SUBMISSIONS';

export const INIT_SUBMISSIONS_STATE = {
  id: 0,
  isFetching: false, // indicates the Submissions is being loaded.
  submissions: [],
  page: 0, // indicates the current page number submission table page.
  pageSize: 10, // indicates number of items per page.
  totalCount: 0, // indicates total number of submission items available on server.
  sortColumn: null, // indicates the column name to sort by
  sortAscending: true // indicates the sort direction (true: ascending | false: descending)
};

// ------------------------------------
// Action: requestSubmissions
// ------------------------------------
export const requestSubmissions = createAction(REQUEST_SUBMISSIONS);

// ------------------------------------
// Action: requestSubmissions
// ------------------------------------
export const receiveSubmissions = createAction(RECEIVE_SUBMISSIONS);

// ------------------------------------
// Action: doneFetchingSubmissions
// ------------------------------------
export const doneFetchingSubmissions = createAction(DONE_FETCHING_SUBMISSIONS);

// ------------------------------------
// Action: fetchSubmissions
// ------------------------------------
export const fetchSubmissions = (options) => {
  return (dispatch, getState) => {
    const submissionsList = getState().submissionsList;
    options = Object.assign(_.pick(submissionsList, [
      'page', // current page number, can be overwritten by options.
      'pageSize', // current page size, can be overwritten by options.
      'sortColumn', // current sort column, can be overwritten by options.
      'sortAscending' // current sort direction, can be overwritten by options.
    ]), options);
    dispatch(requestSubmissions());
    dispatch(processFetchSubmissions(options));
  };
};

// ------------------------------------
// Helper Action: processFetchSubmissions
// Params
//   options: object with fields - page, pageSize, sortAscending, sortColumn
// ------------------------------------
const processFetchSubmissions = (options) => {
  var apiURL = `${API_URL}/form_document/api/form_response/`;

  const query = getPageQueryParamsObject(options);
  const queryString = buildQueryString(query);
  queryString && (apiURL += `?${queryString}`);

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(processReceiveSubmissions(value, options));
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
// Helper Action: processReceiveSubmissions
// ------------------------------------
const processReceiveSubmissions = (res, options) => {
  const totalCount = res.count;
  const data = res.data;
  return (dispatch, getState) => {
    dispatch(receiveSubmissions({
      page: options.page,
      pageSize: options.pageSize,
      sortColumn: options.sortColumn,
      sortAscending: options.sortAscending,
      submissions: data,
      totalCount
    }));
    dispatch(doneFetchingSubmissions()); // Hide loading spinner
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const submissionsReducer = (state = INIT_SUBMISSIONS_STATE, action) => {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, action.payload);
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
