import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';

export const RECEIVE_FORMSLIST = 'RECEIVE_FORMSLIST';
export const REQUEST_FORMSLIST = 'REQUEST_FORMSLIST';
export const DONE_FETCHING_FORMSLIST = 'DONE_FETCHING_FORMSLIST';

export const INIT_FORMSLIST_STATE = {
  id: 0,
  isFetching: false, // indicates the FormsList is being loaded.
  forms: []
};

// ------------------------------------
// Action: processFetchFormsList
// ------------------------------------
export const processFetchFormsList = () => {
  var apiURL = `${API_URL}/form_document/api/form/`;

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveFormsList(value));
      dispatch(doneFetchingFormsList()); // Hide loading spinner
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
// Action: requestFormsList
// ------------------------------------
export const requestFormsList = () => {
  return {
    type: REQUEST_FORMSLIST
  };
};

// ------------------------------------
// Action: receiveFormsList
// ------------------------------------
export const receiveFormsList = (res) => {
  return {
    type: RECEIVE_FORMSLIST,
    forms: res.data
  };
};

// ------------------------------------
// Action: doneFetchingFormsList
// ------------------------------------
export const doneFetchingFormsList = () => {
  return {
    type: DONE_FETCHING_FORMSLIST
  };
};

// ------------------------------------
// Action: fetchFormsList
// ------------------------------------
export const fetchFormsList = (id) => {
  return (dispatch, getState) => {
    dispatch(requestFormsList());
    dispatch(processFetchFormsList());
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const formsListReducer = (state = INIT_FORMSLIST_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORMSLIST:
      return Object.assign({}, state, {
        forms: action.forms
      });
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
