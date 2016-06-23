import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { mergeItemIntoArray } from 'helpers/pureFunctions';
import { getImageDimension } from 'helpers/formBuilderHelper';

export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';

export const SET_ACTIVE_INPUT_NAME = 'SET_ACTIVE_INPUT_NAME';
export const ADD_ELEMENT = 'ADD_ELEMENT';
export const UPDATE_MAPPING_INFO = 'UPDATE_MAPPING_INFO';

export const SET_CURRENT_QUESTION_ID = 'SET_CURRENT_QUESTION_ID';

export const SET_PAGE_ZOOM = 'SET_PAGE_ZOOM';
export const SET_PAGE_WIDTH = 'SET_PAGE_WIDTH';

export const INIT_BUILDER_STATE = {
  id: 0,
  isFetching: false, // indicates the form is being loaded.
  isSubmitting: false, // indicates the form submission is being processed.
  questions: [],
  logics: [],
  documents: [
    {
      url: 'http://localhost:3000/doc_example1.jpg', // for temp purpose, should fetch from backend.
      width: 1020,
      height: 1441
    },
    {
      url: 'http://localhost:3000/doc_example2.jpg', // for temp purpose, should fetch from backend.
      width: 620,
      height: 877
    }
  ],
  formConfig: {},
  documentMapping: [],
  activeInputName: '',
  currentQuestionId: 0,
  lastQuestionId: 0,
  formAccessCode: '1234',
  pageZoom: 1,
  pageWidth: 0
};

// ------------------------------------
// Action: processFetchForm
// ------------------------------------
export const processFetchForm = (id, accessCode) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/`;
  if (accessCode.length > 0) 
    apiURL += `?access_code=${accessCode}`;
  const fetchParams = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    method: 'GET'
  };

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(id, value));
      dispatch(doneFetchingForm()); // Hide loading spinner
    }
  };
  
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingForm()); // Hide loading spinner
    }
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
}

// ------------------------------------
// Action: requestForm
// ------------------------------------
export const requestForm = () => {
  return {
    type: REQUEST_FORM
  };
}

// ------------------------------------
// Action: receiveForm
// ------------------------------------
export const receiveForm = (id, data) => {
  return {
    type: RECEIVE_FORM,
    id: id,
    questions: data.form_data.questions,
    logics: data.form_data.logics,
    documents: data.assets_urls,
    formConfig: data.form_config,
    title: data.title,
    slug: data.slug,
  };
}

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = () => {
  return {
    type: DONE_FETCHING_FORM
  };
}

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id) => {
  return (dispatch, getState) => {
    const formBuilder = getState().formBuilder;
    dispatch(requestForm());
    dispatch(processFetchForm(id, formBuilder.formAccessCode));
  }
}

// ------------------------------------
// Action: setActiveInputName
// ------------------------------------
export const setActiveInputName = (inputName) => {
  return {
    type: SET_ACTIVE_INPUT_NAME,
    inputName
  };
}

// ------------------------------------
// Action: addElement
// ------------------------------------
export const addElement = (element) => {
  return {
    type: ADD_ELEMENT,
    element
  };
}

const _addElement = (state, action) => {
  var { question, mappingInfo } = action.element;
  const newQuestionId = state.lastQuestionId + 1;
  question.id = newQuestionId;
  mappingInfo.id = newQuestionId;
  return {
    questions: mergeItemIntoArray(state.questions, question),
    documentMapping: mergeItemIntoArray(state.documentMapping, mappingInfo),
    lastQuestionId: newQuestionId,
    currentQuestionId: newQuestionId
  };
}

// ------------------------------------
// Action: addElement
// ------------------------------------
export const updateMappingInfo = (mappingInfo) => {
  return {
    type: UPDATE_MAPPING_INFO,
    mappingInfo
  };
}

// ------------------------------------
// Action: setCurrentQuestionId
// ------------------------------------
export const setCurrentQuestionId = (id) => {
  return {
    type: SET_CURRENT_QUESTION_ID,
    id
  };
}

// ------------------------------------
// Action: setPageZoom
// ------------------------------------
export const setPageZoom = (pageZoom) => {
  return {
    type: SET_PAGE_ZOOM,
    pageZoom
  };
}
// ------------------------------------
// Action: refreshPageWidth
// ------------------------------------
export const refreshPageWidth = (id) => {
  return (dispatch, getState) => {
    const formBuilder = getState().formBuilder;
    if (formBuilder.documents.length > 0) {
      getImageDimension(formBuilder.documents[0], (size) => {
        dispatch(setPageWidth(size.width));
      })
    }
  }
}

export const setPageWidth = (pageWidth) => {
  return {
    type: SET_PAGE_WIDTH,
    pageWidth
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const formBuilderReducer = (state = INIT_BUILDER_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id,
        questions: action.questions,
        logics: action.logics,
        documents: action.documents,
        formConfig: action.formConfig,
        title: action.title,
        slug: action.slug,
      });
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true
      });
    case DONE_FETCHING_FORM:
      return Object.assign({}, state, {
        isFetching: false
      });
    case REQUEST_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: true
      });
    case DONE_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: false
      });
    case SET_ACTIVE_INPUT_NAME:
      return Object.assign({}, state, {
        activeInputName: action.inputName
      });
    case ADD_ELEMENT:
      return Object.assign({}, state, _addElement(state, action));
    case UPDATE_MAPPING_INFO:
      return Object.assign({}, state, {
        documentMapping: mergeItemIntoArray(state.documentMapping, action.mappingInfo)
      });
    case SET_CURRENT_QUESTION_ID:
      return Object.assign({}, state, {
        currentQuestionId: action.id
      });
    case SET_PAGE_ZOOM:
      return Object.assign({}, state, {
        pageZoom: action.pageZoom
      });
    case SET_PAGE_WIDTH:
      return Object.assign({}, state, {
        pageWidth: action.pageWidth
      });
    default:
      return state;
  };
}

export default formBuilderReducer;
