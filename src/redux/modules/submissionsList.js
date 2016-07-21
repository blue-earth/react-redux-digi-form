import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
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

const getQueryParamsObject = (options) => {
  var query = {};
  options.page && (query['page'] = options.page);
  options.pageSize && (query['page_size'] = options.pageSize);
  if (options.sortColumn) {
    query['ordering'] = options.sortAscending ? options.sortColumn : '-' + options.sortColumn;
  }
  return query;
};

// ------------------------------------
// Action: processFetchSubmissions
// Params
//   query: Avilable query params - page, page_size, ordering
// ------------------------------------
export const processFetchSubmissions = (options) => {
  var apiURL = `${API_URL}/form_document/api/form_response/`;

  const query = getQueryParamsObject(options);
  const queryString = buildQueryString(query);
  queryString && (apiURL += `?${queryString}`);

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveSubmissions(value, options));
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
export const receiveSubmissions = (data, options) => {
  // TODO: Emulate sorting & pagination, should be done in backend.
  const totalCount = data.length;
  if (options.sortColumn) {
    data = _.orderBy(
      data,
      (item) => item[options.sortColumn],
      options.sortAscending ? 'asc' : 'desc'
    );
  }
  const tempStartIndex = (options.page) * options.pageSize;
  data = data.slice(tempStartIndex, tempStartIndex + options.pageSize);
  // TODO: End

  return Object.assign({}, options, {
    type: RECEIVE_SUBMISSIONS,
    submissions: data,
    totalCount // TODO: need accurate field in api response.
  });
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
// Reducer
// ------------------------------------
const submissionsReducer = (state = INIT_SUBMISSIONS_STATE, action) => {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, {
        submissions: action.submissions,
        page: action.page,
        pageSize: action.pageSize,
        sortColumn: action.sortColumn,
        sortAscending: action.sortAscending,
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
    default:
      return state;
  }
};

export default submissionsReducer;
