import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { buildQueryString } from 'helpers/pureFunctions';
import { getPageQueryParamsObject } from 'helpers/pageListingHelpers';
import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
import { goTo } from './router';
import { editFormUrl } from 'helpers/urlHelper';
import { hide } from 'redux-modal';

export const RECEIVE_FORMSLIST = 'RECEIVE_FORMSLIST';
export const REQUEST_FORMSLIST = 'REQUEST_FORMSLIST';
export const DONE_FETCHING_FORMSLIST = 'DONE_FETCHING_FORMSLIST';
export const SELECT_FORM_ITEMS = 'SELECT_FORM_ITEMS';

const REQUEST_SEND_FORM_LINK = 'REQUEST_SEND_FORM_LINK';
const DONE_SEND_FORM_LINK = 'DONE_SEND_FORM_LINK';

const SET_STATUS_FILTER_OPTIONS = 'SET_STATUS_FILTER_OPTIONS';
const SET_FORMSLIST_PAGE_SIZE = 'SET_FORMSLIST_PAGE_SIZE';
const NEXT_FORMSLIST_PAGE = 'NEXT_FORMSLIST_PAGE';
const PREVIOUS_FORMSLIST_PAGE = 'PREVIOUS_FORMSLIST_PAGE';

export const INIT_FORMSLIST_STATE = {
  id: 0,
  isFetchingForms: false, // indicates the FormsList is being loaded.
  forms: [],
  page: 1, // indicates the current page number submission table page.
  pageSize: 5, // indicates number of items per page.
  totalCount: 0, // indicates total number of submission items available on server.
  sortColumn: 'id', // indicates the column name to sort by
  isSortAscending: false, // indicates the sort direction (true: ascending | false: descending)
  selectedStatusFilterOptions: '0,1',
  selectedItems: [], // holds the selected items id.
  isSendingEmail: false // indicates an email is being sent by the backend
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

export const requestSendFormLink = createAction(REQUEST_SEND_FORM_LINK);
export const doneSendFormLink = createAction(DONE_SEND_FORM_LINK);

// ------------------------------------
// Action: selectItems
// ------------------------------------
export const selectItems = createAction(SELECT_FORM_ITEMS);

const nextFormslistPage = createAction(NEXT_FORMSLIST_PAGE);
const previousFormslistPage = createAction(PREVIOUS_FORMSLIST_PAGE);

export const setPageSize = createAction(SET_FORMSLIST_PAGE_SIZE);

const setStatusFilterOptions = createAction(SET_STATUS_FILTER_OPTIONS);
export const filterFormsByStatus = (newStatus) => {
  return (dispatch, getState) => {
    dispatch(setStatusFilterOptions(newStatus));
    dispatch(fetchFormsList({
      status: newStatus
    }));
  };
};

export const goToNextPage = () => {
  return (dispatch, getState) => {
    dispatch(nextFormslistPage());
    dispatch(fetchFormsList({
      page: getState().formsList.page
    }));
  };
};
export const goToPreviousPage = () => {
  return (dispatch, getState) => {
    dispatch(previousFormslistPage());
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
      'isSortAscending', // current sort direction, can be overwritten by options.
      'status'
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

export const archiveForms = (items) => {
  return (dispatch, getState) => {
    items.map((item) => {
      dispatch(processArchiveForm(item));
    });
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
      dispatch(fetchFormsList());
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
  const apiURL = `${API_URL}/form_document/api/form/${id}/duplicate/`;
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

export const sendFormLink = (id, email, firstName, lastName) => {
  return (dispatch, getState) => {
    dispatch(requestSendFormLink());
    dispatch(processSendForm(id, email, firstName, lastName));
  };
};

const processSendForm = (id, email, firstName, lastName) => {
  const apiURL = `${API_URL}/form_document/api/form/${id}/email_form_tracking_link/`;
  let body = {
    email
  };
  if (firstName) {
    Object.assign(body, {first_name: firstName});
  }
  if (lastName) {
    Object.assign(body, {last_name: lastName});
  }
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(doneSendFormLink());
      dispatch(hide('sendFormLinkModal'));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      // Todo: Handler for failed send form link
      dispatch(doneSendFormLink());
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
//   options: object with fields - page, pageSize, isSortAscending, sortColumn
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
      if (options.page !== 1) {
        dispatch(fetchFormsList({page: options.page - 1}));
      }
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
      selectedItems: [],
      page: options.page || 1,
      pageSize: options.pageSize,
      sortColumn: options.sortColumn,
      isSortAscending: options.isSortAscending,
      forms: data,
      totalCount
    }));
    dispatch(doneFetchingFormsList()); // Hide loading spinner
  };
};

// ------------------------------------
// Action: setFormStatus
// ------------------------------------
export const setFormStatus = (formId, newStatus) => {
  return (dispatch, getState) => {
    if (Array.isArray(formId)) {
      formId.map((id) => {
        dispatch(processSetFormStatus(id, newStatus));
      });
    } else {
      dispatch(processSetFormStatus(formId, newStatus));
    }
  };
};
export const processSetFormStatus = (formId, newStatus) => {
  var body = {id: formId, status: newStatus};
  var method = 'PUT';
  var requestURL = `${API_URL}/form_document/api/form/${formId}/`;
  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(fetchFormsList());
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      console.error('Failed to update form status');
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Reducer
// ------------------------------------
const formsListReducer = handleActions({

  RECEIVE_FORMSLIST: (state, action) =>
    Object.assign({}, state, action.payload),

  REQUEST_FORMSLIST: (state, action) =>
    Object.assign({}, state, {
      isFetchingForms: true
    }),

  DONE_FETCHING_FORMSLIST: (state, action) =>
    Object.assign({}, state, {
      isFetchingForms: false
    }),
  REQUEST_SEND_FORM_LINK: (state, action) =>
    Object.assign({}, state, {
      isSendingEmail: true
    }),
  DONE_SEND_FORM_LINK: (state, action) =>
    Object.assign({}, state, {
      isSendingEmail: false
    }),

  SELECT_FORM_ITEMS: (state, action) =>
    Object.assign({}, state, {
      selectedItems: action.payload
    }),
  SET_FORMSLIST_PAGE_SIZE: (state, action) =>
    Object.assign({}, state, {
      pageSize: parseInt(action.payload),
      page: 1
    }),
  SET_STATUS_FILTER_OPTIONS: (state, action) =>
    Object.assign({}, state, {
      selectedStatusFilterOptions: action.payload,
      page: 1
    }),
  NEXT_FORMSLIST_PAGE: (state, action) =>
    Object.assign({}, state, {
      page: state.page + 1
    }),
  PREVIOUS_FORMSLIST_PAGE: (state, action) =>
    Object.assign({}, state, {
      page: state.page - 1
    })
}, INIT_FORMSLIST_STATE);

export default formsListReducer;
