import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
import { getPageQueryParamsObject } from 'helpers/pageListingHelpers';
import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

export const RECEIVE_SUBMISSIONS = 'RECEIVE_SUBMISSIONS';
export const REQUEST_SUBMISSIONS = 'REQUEST_SUBMISSIONS';
export const DONE_FETCHING_SUBMISSIONS = 'DONE_FETCHING_SUBMISSIONS';
export const SELECT_SUBMISSION_ITEMS = 'SELECT_SUBMISSION_ITEMS';

export const SELECT_ANALYTICS_PERIOD = 'SELECT_ANALYTICS_PERIOD';

export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';

export const INIT_SUBMISSIONS_STATE = {
  id: 0,
  isFetching: false, // indicates the Submissions is being loaded.
  submissions: [], // holds the submission data.
  page: 0, // indicates the current page number submission table page.
  pageSize: 10, // indicates number of items per page.
  totalCount: 0, // indicates total number of submission items available on server.
  sortColumn: 'response_id', // indicates the column name to sort by
  sortAscending: true, // indicates the sort direction (true: ascending | false: descending)
  selectedItems: [], // holds the selected items id.
  analyticsPeriod: 'today', // indicates the selected period of analytics
  analytics: {
    today: {
      view: 1235,
      rate: 0.12
    },
    week: {
      view: 13433,
      rate: 0.65
    },
    month: {
      view: 923430,
      rate: 0.78349
    }
  },
  activities: [
    {
      name: 'Jordan McCown',
      action: 'completed',
      form: 'SMSF Non Corporate CFD',
      time: '2m ago'
    }, {
      name: 'Lihan Li',
      action: 'viewed',
      form: 'Personal Form',
      time: '5m ago'
    }, {
      name: 'Shaun Harvey',
      action: 'viewed',
      form: 'Personal Form',
      time: '1h ago'
    }, {
      name: 'Andrew Olsen',
      action: 'completed',
      form: 'Tonik Employment Form',
      time: '2h ago'
    }, {
      name: 'Someone Else',
      action: 'deleted',
      form: 'Something Important Form',
      time: '5h ago'
    }
  ],
  environmentalSavings: {
    trees: 12,
    water: 3850,
    co2: 120
  }
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
// Action: selectItems
// ------------------------------------
export const selectItems = createAction(SELECT_SUBMISSION_ITEMS);

export const selectAnalyticsPeriod = createAction(SELECT_ANALYTICS_PERIOD);

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
// Action: selectAllItems
// ------------------------------------
export const selectAllItems = (selected) => {
  return (dispatch, getState) => {
    var selectedItems = [];
    if (selected) {
      const submissionsList = getState().submissionsList;
      const submissions = submissionsList.submissions;
      selectedItems = _.map(submissions, 'response_id');
    }
    dispatch(selectItems(selectedItems));
  };
};

// ------------------------------------
// Action: toggleSelectItem
// ------------------------------------
export const toggleSelectItem = (id) => {
  return (dispatch, getState) => {
    const submissionsList = getState().submissionsList;
    const selectedItems = submissionsList.selectedItems;
    const newSelectedItems = _.xor(selectedItems, [id]);
    dispatch(selectItems(newSelectedItems));
  };
};

// ------------------------------------
// Action: selectItem()
// ------------------------------------
export const selectItem = ({id, selected}) => {
  return (dispatch, getState) => {
    const submissionsList = getState().submissionsList;
    var selectedItems = submissionsList.selectedItems;
    if (selected) {
      selectedItems = _.union(selectedItems, [id]);
    } else {
      selectedItems = _.difference(selectedItems, [id]);
    }
    dispatch(selectItems(selectedItems));
  };
};

export const setPageSize = createAction(SET_PAGE_SIZE);

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
      totalCount,
      selectedItems: []
    }));
    dispatch(doneFetchingSubmissions()); // Hide loading spinner
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const submissionsReducer = handleActions({
  RECEIVE_SUBMISSIONS: (state, action) =>
    Object.assign({}, state, action.payload),

  REQUEST_SUBMISSIONS: (state, action) =>
    Object.assign({}, state, {
      isFetching: true
    }),

  DONE_FETCHING_SUBMISSIONS: (state, action) =>
    Object.assign({}, state, {
      isFetching: false
    }),

  SELECT_SUBMISSION_ITEMS: (state, action) =>
    Object.assign({}, state, {
      selectedItems: action.payload
    }),

  SELECT_ANALYTICS_PERIOD: (state, action) =>
    Object.assign({}, state, {
      analyticsPeriod: action.payload
    }),

  SET_PAGE_SIZE: (state, action) =>
    Object.assign({}, state, {
      pageSize: action.payload
    })
}, INIT_SUBMISSIONS_STATE);

export default submissionsReducer;
