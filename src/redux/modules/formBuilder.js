import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { mergeItemIntoArray, findItemById } from 'helpers/pureFunctions';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

export const NEW_FORM = 'NEW_FORM';
export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';

export const SET_ACTIVE_INPUT_NAME = 'SET_ACTIVE_INPUT_NAME';
export const EDIT_ELEMENT = 'EDIT_ELEMENT';
export const SAVE_ELEMENT = 'SAVE_ELEMENT';
export const DELETE_ELEMENT = 'DELETE_ELEMENT';

export const UPDATE_QUESTION_INFO = 'UPDATE_QUESTION_INFO';
export const UPDATE_MAPPING_INFO = 'UPDATE_MAPPING_INFO';

export const SET_CURRENT_QUESTION_ID = 'SET_CURRENT_QUESTION_ID';

export const SET_QUESTION_EDIT_MODE = 'SET_QUESTION_EDIT_MODE';

export const SET_PAGE_ZOOM = 'SET_PAGE_ZOOM';

export const INIT_BUILDER_STATE = {
  id: 0,
  isFetching: false, // indicates the form is being loaded.
  isSubmitting: false, // indicates the form submission is being processed.
  isModified: false, // indicates the form is modified since last load or submission.
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
  currentElement: null, // holds the current element state being added or edited.
  currentQuestionId: 0, // indicates the question connected with selected element.
  lastQuestionId: 0, // indicates lastly added question id
  pageZoom: 1, // zoom ratio of PageView
  questionEditMode: false
};

export const INIT_QUESTION_STATE = {
  id: undefined, // Question ID
  type: 'ShortTextField', // Question type
  question_instruction: '', // Question instruction
  question_description: '', // Question description
  placeholder_text: undefined, // Question placeholder text
  attachment: null, // Question attachment
  validations: [], // Question validations
  verifications: [], // Question verifications
  group: 0 // Question group
};

// ------------------------------------
// Action: newForm
// ------------------------------------
export const newForm = createAction(NEW_FORM);

// ------------------------------------
// Helper Action: processFetchForm
// ------------------------------------
export const processFetchForm = (id) => {
  var apiURL = `${API_URL}/form_document/api/form/${id}/`;
  apiURL += '?access_code=1234'; // Temporary
  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(_.merge({id}, value)));
      dispatch(doneFetchingForm()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingForm()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: requestForm
// ------------------------------------
export const requestForm = createAction(REQUEST_FORM);

// ------------------------------------
// Action: receiveForm
// ------------------------------------
export const receiveForm = createAction(RECEIVE_FORM, (data) => ({
  id: data.id,
  questions: data.form_data.questions ? data.form_data.questions : [],
  logics: data.form_data.logics ? data.form_data.logics : [],
  documents: data.assets_urls ? data.assets_urls : [],
  formConfig: data.form_config,
  title: data.title,
  slug: data.slug,
  isModified: false
}));

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = createAction(DONE_FETCHING_FORM);

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id) => {
  return (dispatch, getState) => {
    const formBuilder = getState().formBuilder;
    dispatch(requestForm());
    dispatch(processFetchForm(id, formBuilder.formAccessCode));
  };
};

// ------------------------------------
// Action: setActiveInputName
// ------------------------------------
export const setActiveInputName = createAction(SET_ACTIVE_INPUT_NAME);

// ------------------------------------
// Action: saveElement
// ------------------------------------
export const saveElement = createAction(SAVE_ELEMENT);

// ------------------------------------
// Helper: _saveElement
// ------------------------------------
const _saveElement = (state, action) => {
  const { currentElement } = state;
  var question = Object.assign({}, INIT_QUESTION_STATE, currentElement.question);
  var mappingInfo = _.defaultTo(currentElement.mappingInfo, {});
  const newQuestionId = currentElement.id ? currentElement.id : state.lastQuestionId + 1;

  question.id = newQuestionId;
  mappingInfo.id = newQuestionId;

  return Object.assign({}, state, {
    questions: mergeItemIntoArray(state.questions, question),
    documentMapping: mergeItemIntoArray(state.documentMapping, mappingInfo, true),
    lastQuestionId: newQuestionId,
    currentQuestionId: newQuestionId
  });
};

// ------------------------------------
// Action: deleteElement
// ------------------------------------
export const deleteElement = createAction(DELETE_ELEMENT);

// ------------------------------------
// Helper: _deleteElement
// ------------------------------------
const _deleteElement = (state, action) => {
  const id = action.payload;
  return Object.assign({}, state, {
    questions: _.pullAllBy(state.questions, [{id}], 'id'),
    documentMapping: _.pullAllBy(state.documentMapping, [{id}], 'id'),
    currentQuestionId: 0,
    questionEditMode: false,
    isModified: true
  });
};

// ------------------------------------
// Action: updateQuestionInfo
// ------------------------------------
export const updateQuestionInfo = createAction(UPDATE_QUESTION_INFO);

// ------------------------------------
// Helper: _updateQuestionInfo
// ------------------------------------
const _updateQuestionInfo = (state, action) => {
  const { currentElement: { question } } = state;
  const { instruction, description, type } = action.payload;
  const newQuestion = {
    'type': typeof type !== 'undefined' ? type : question.type,
    'question_instruction': typeof instruction !== 'undefined' ? instruction : question.instruction,
    'question_description': typeof description !== 'undefined' ? description : question.description
  };
  return _updateCurrentElement(state, {
    question: Object.assign({}, question, newQuestion)
  });
};

// ------------------------------------
// Action: updateMappingInfo
// ------------------------------------
export const updateMappingInfo = createAction(UPDATE_MAPPING_INFO);

// ------------------------------------
// Helper: _updateQuestionInfo
// ------------------------------------
const _updateMappingInfo = (state, action) => {
  const mappingInfo = {
    'page_number': action.payload.pageNumber,
    'bounding_box': action.payload.boundingBox
  };
  return _updateCurrentElement(state, { mappingInfo });
};

// ------------------------------------
// Helper Action: _updateCurrentElement
// ------------------------------------
export const _updateCurrentElement = (state, element) => {
  return Object.assign({}, state, {
    currentElement: Object.assign({}, state.currentElement, element),
    isModified: true
  });
};

// ------------------------------------
// Action: setCurrentQuestionId
// ------------------------------------
export const setCurrentQuestionId = createAction(SET_CURRENT_QUESTION_ID);

// ------------------------------------
// Action: setPageZoom
// ------------------------------------
export const setPageZoom = createAction(SET_PAGE_ZOOM);

// ------------------------------------
// Action: setQuestionEditMode
// ------------------------------------
export const setQuestionEditMode = createAction(SET_QUESTION_EDIT_MODE);

const _setQuestionEditMode = (state, action) => {
  const id = action.payload.id;
  const question = id ? findItemById(state.questions, id) : INIT_QUESTION_STATE;
  const currentElement = {
    id,
    question,
    logic: id ? findItemById(state.logics, id) : {},
    mappingInfo: id ? findItemById(state.documentMapping, id) : {}
  };
  return Object.assign({}, state, {
    currentElement,
    questionEditMode: action.payload.mode,
    activeInputName: _.defaultTo(id ? question.type : action.payload.inputType, '')
  });
};

// ------------------------------------
// Reducer
// ------------------------------------
const formBuilderReducer = handleActions({
  NEW_FORM: (state, action) =>
    Object.assign({}, INIT_BUILDER_STATE),

  RECEIVE_FORM: (state, action) =>
    Object.assign({}, state, action.payload),

  REQUEST_FORM: (state, action) =>
    Object.assign({}, state, {
      isFetching: true
    }),

  DONE_FETCHING_FORM: (state, action) =>
    Object.assign({}, state, {
      isFetching: false
    }),

  REQUEST_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: true
    }),

  DONE_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: false
    }),

  SET_ACTIVE_INPUT_NAME: (state, action) =>
    Object.assign({}, state, {
      activeInputName: action.payload
    }),

  SAVE_ELEMENT: (state, action) =>
    _saveElement(state, action),

  DELETE_ELEMENT: (state, action) =>
    _deleteElement(state, action),

  UPDATE_QUESTION_INFO: (state, action) =>
    _updateQuestionInfo(state, action),

  UPDATE_MAPPING_INFO: (state, action) =>
    _updateMappingInfo(state, action),

  SET_CURRENT_QUESTION_ID: (state, action) =>
    Object.assign({}, state, {
      currentQuestionId: action.payload
    }),

  SET_PAGE_ZOOM: (state, action) =>
    Object.assign({}, state, {
      pageZoom: action.payload
    }),

  SET_QUESTION_EDIT_MODE: (state, action) =>
    _setQuestionEditMode(state, action)
}, INIT_BUILDER_STATE);

export default formBuilderReducer;
