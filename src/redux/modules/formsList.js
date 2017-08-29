import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
import { getPageQueryParamsObject } from 'helpers/pageListingHelpers';
import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
import { goTo } from './router';
import { editFormUrl } from 'helpers/urlHelper';

export const RECEIVE_FORMSLIST = 'RECEIVE_FORMSLIST';
export const REQUEST_FORMSLIST = 'REQUEST_FORMSLIST';
export const DONE_FETCHING_FORMSLIST = 'DONE_FETCHING_FORMSLIST';
export const SELECT_FORM_ITEMS = 'SELECT_FORM_ITEMS';

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const NEXT_PAGE = 'NEXT_PAGE';
const PREVIOUS_PAGE = 'PREVIOUS_PAGE';

export const INIT_FORMSLIST_STATE = {
  id: 0,
  isFetching: false, // indicates the FormsList is being loaded.
  forms: [],
  page: 1, // indicates the current page number submission table page.
  pageSize: 5, // indicates number of items per page.
  totalCount: 0, // indicates total number of submission items available on server.
  sortColumn: 'id', // indicates the column name to sort by
  sortAscending: true, // indicates the sort direction (true: ascending | false: descending)
  selectedItems: [] // holds the selected items id.
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
// Action: selectItems
// ------------------------------------
export const selectItems = createAction(SELECT_FORM_ITEMS);

const goToNextPage = createAction(NEXT_PAGE);
const goToPreviousPage = createAction(PREVIOUS_PAGE);

export const setPageSize = createAction(SET_PAGE_SIZE);
export const next = () => {
  return (dispatch, getState) => {
    dispatch(goToNextPage());
    dispatch(fetchFormsList({
      page: getState().formsList.page
    }));
  };
};
export const previous = () => {
  return (dispatch, getState) => {
    dispatch(goToPreviousPage());
    dispatch(fetchFormsList({
      page: getState().formsList.page
    }));
  };
};

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
// Action: ArchiveForm
// ------------------------------------
export const archiveForm = (id) => {
  return (dispatch, getState) => {
    dispatch(processArchiveForm(id));
  };
};

const processArchiveForm = (id) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/archive/`;
  const body = {};
  const fetchParams = assignDefaults({
    method: 'DELETE',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(fetchFormsList({page: 1}));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

export const deleteForm = (id) => {
  return (dispatch, getState) => {
    dispatch(processDeleteForm(id));
  };
};

const processDeleteForm = (id) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/`;
  const body = {};
  const fetchParams = assignDefaults({
    method: 'DELETE',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(fetchFormsList({page: 1}));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: DuplicateForm
// ------------------------------------
export const duplicateForm = (id) => {
  return (dispatch, getState) => {
    dispatch(processDuplicateForm(id));
  };
};

const processDuplicateForm = (id) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/duplicate/`;
  const body = {};
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(goTo(editFormUrl(value.id)));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      // Todo: Handler for failed duplicate form
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};
// ------------------------------------
// Action: selectAllItems
// ------------------------------------
export const selectAllItems = (selected) => {
  return (dispatch, getState) => {
    var selectedItems = [];
    if (selected) {
      const formsList = getState().formsList;
      const forms = formsList.forms;
      selectedItems = _.map(forms, 'id');
    }
    dispatch(selectItems(selectedItems));
  };
};

// ------------------------------------
// Action: toggleSelectItem
// ------------------------------------
export const toggleSelectItem = (id) => {
  return (dispatch, getState) => {
    const formsList = getState().formsList;
    const selectedItems = formsList.selectedItems;
    const newSelectedItems = _.xor(selectedItems, [id]);
    dispatch(selectItems(newSelectedItems));
  };
};

// ------------------------------------
// Action: selectItem()
// ------------------------------------
export const selectItem = ({id, selected}) => {
  return (dispatch, getState) => {
    const formsList = getState().formsList;
    var selectedItems = formsList.selectedItems;
    if (selected) {
      selectedItems = _.union(selectedItems, [id]);
    } else {
      selectedItems = _.difference(selectedItems, [id]);
    }
    dispatch(selectItems(selectedItems));
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
      page: options.page || 1,
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
const formsListReducer = handleActions({

  RECEIVE_FORMSLIST: (state, action) =>
    Object.assign({}, state, action.payload),

  REQUEST_FORMSLIST: (state, action) =>
    Object.assign({}, state, {
      isFetching: true
    }),

  DONE_FETCHING_FORMSLIST: (state, action) =>
    Object.assign({}, state, {
      isFetching: false
    }),

  SELECT_FORM_ITEMS: (state, action) =>
    Object.assign({}, state, {
      selectedItems: action.payload
    }),
  SET_PAGE_SIZE: (state, action) =>
    Object.assign({}, state, {
      pageSize: parseInt(action.payload),
      page: 1
    }),
  NEXT_PAGE: (state, action) =>
    Object.assign({}, state, {
      page: state.page + 1
    }),
  PREVIOUS_PAGE: (state, action) =>
    Object.assign({}, state, {
      page: state.page - 1
    })
}, INIT_FORMSLIST_STATE);

export default formsListReducer;
