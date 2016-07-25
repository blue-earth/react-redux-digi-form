import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
import { getPageQueryParamsObject } from 'helpers/pageListingHelpers';
import { createAction } from 'redux-actions';
import _ from 'lodash';

export const RECEIVE_FORMSLIST = 'RECEIVE_FORMSLIST';
export const REQUEST_FORMSLIST = 'REQUEST_FORMSLIST';
export const DONE_FETCHING_FORMSLIST = 'DONE_FETCHING_FORMSLIST';

export const INIT_FORMSLIST_STATE = {
  id: 0,
  isFetching: false, // indicates the FormsList is being loaded.
  forms: [],
  page: 0, // indicates the current page number submission table page.
  pageSize: 10, // indicates number of items per page.
  totalCount: 0, // indicates total number of submission items available on server.
  sortColumn: null, // indicates the column name to sort by
  sortAscending: true // indicates the sort direction (true: ascending | false: descending)
};

// ------------------------------------
// Action: requestFormsList
// ------------------------------------
export const requestFormsList = createAction(REQUEST_FORMSLIST);

// ------------------------------------
// Action: requestFormsList
// ------------------------------------
export const receiveFormsList = createAction(RECEIVE_FORMSLIST);

// ------------------------------------
// Action: doneFetchingFormsList
// ------------------------------------
export const doneFetchingFormsList = createAction(DONE_FETCHING_FORMSLIST);

// ------------------------------------
// Action: fetchFormsList
// ------------------------------------
export const fetchFormsList = (options) => {
  return (dispatch, getState) => {
    const formsList = getState().formsList;
    options = Object.assign(_.pick(formsList, [
      'page', // current page number, can be overwritten by options.
      'pageSize', // current page size, can be overwritten by options.
      'sortColumn', // current sort column, can be overwritten by options.
      'sortAscending' // current sort direction, can be overwritten by options.
    ]), options);
    dispatch(requestFormsList());
    dispatch(processFetchFormsList(options));
  };
};

// ------------------------------------
// Helper Action: processFetchFormsList
// Params
//   options: object with fields - page, pageSize, sortAscending, sortColumn
// ------------------------------------
const processFetchFormsList = (options) => {
  var apiURL = `${API_URL}/form_document/api/form/`;

  const query = getPageQueryParamsObject(options);
  const queryString = buildQueryString(query);
  queryString && (apiURL += `?${queryString}`);

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(processReceiveFormsList(value, options));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingFormsList()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Helper Action: processReceiveFormsList
// ------------------------------------
const processReceiveFormsList = (res, options) => {
  const totalCount = res.count;
  const data = res.data;

  return (dispatch, getState) => {
    dispatch(receiveFormsList({
      page: options.page,
      pageSize: options.pageSize,
      sortColumn: options.sortColumn,
      sortAscending: options.sortAscending,
      forms: data,
      totalCount
    }));
    dispatch(doneFetchingFormsList()); // Hide loading spinner
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const formsListReducer = (state = INIT_FORMSLIST_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORMSLIST:
      return Object.assign({}, state, action.payload);
    case REQUEST_FORMSLIST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DONE_FETCHING_FORMSLIST:
      return Object.assign({}, state, {
        isFetching: false
      });
    default:
      return state;
  }
};

export default formsListReducer;
