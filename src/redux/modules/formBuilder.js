import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { findItemById, mergeItemIntoArray } from 'helpers/pureFunctions';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import {
  formBuilderBoxMappingType,
  formBuilderFontSize,
  formBuilderPathIndex,
  formBuilderSelectMode
} from 'constants/formBuilder';
import _ from 'lodash';
import humps from 'humps';

export const NEW_FORM = 'NEW_FORM';
export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
export const REQUEST_FORM_SUBMIT = 'REQUEST_FORM_SUBMIT';
export const DONE_FORM_SUBMIT = 'DONE_FORM_SUBMIT';

export const SET_ACTIVE_INPUT_NAME = 'SET_ACTIVE_INPUT_NAME';
export const EDIT_ELEMENT = 'EDIT_ELEMENT';
export const SAVE_ELEMENT = 'SAVE_ELEMENT';
export const DELETE_ELEMENT = 'DELETE_ELEMENT';

export const SET_QUESTION_INFO = 'SET_QUESTION_INFO';
export const RESET_QUESTION_INFO = 'RESET_QUESTION_INFO';
export const SET_MAPPING_INFO = 'SET_MAPPING_INFO';
export const SET_VALIDATION_INFO = 'SET_VALIDATION_INFO';
export const RESET_VALIDATION_INFO = 'RESET_VALIDATION_INFO';

export const SET_MAPPING_POSITION_INFO = 'SET_MAPPING_POSITION_INFO';

export const UPDATE_FORM_ID = 'UPDATE_FORM_ID';
export const SET_QUESTION_EDIT_MODE = 'SET_QUESTION_EDIT_MODE';
export const SET_CURRENT_ELEMENT = 'SET_CURRENT_ELEMENT';
export const SET_PAGE_ZOOM = 'SET_PAGE_ZOOM';

export const SET_ACTIVE_BOX = 'SET_ACTIVE_BOX';

export const SET_CURRENT_STEP = 'SET_CURRENT_STEP';
export const UPDATE_STORE = 'UPDATE_STORE';

export const SET_FORM_STATUS = 'SET_FORM_STATUS';

export const INIT_BUILDER_STATE = {
  id: 0,
  isFetching: false, // indicates the form is being loaded.
  isSubmitting: false, // indicates the form submission is being processed.
  isModified: false, // indicates the form is modified since last load or submission.
  title: 'New form',
  slug: 'new-form',
  subdomain: '',
  questions: [],
  logics: [],
  documents: [
    // {
    //   url: 'http://localhost:3000/doc_example1.jpg', // for temp purpose, should fetch from backend.
    //   width: 1020,
    //   height: 1441
    // },
    // {
    //   url: 'http://localhost:3000/doc_example2.jpg', // for temp purpose, should fetch from backend.
    //   width: 620,
    //   height: 877
    // }
  ],
  formConfig: {
    customise: {
      footer: '',
      primaryColour: '#ffffff',
      accentColour: '#ffffff',
      emondoBranding: true
    },
    notifications: {},
    security: []
  },
  documentMapping: {},
  currentElement: null, // holds the current element state being added or edited.
  lastQuestionId: 0, // indicates lastly added question id
  pageZoom: 1, // zoom ratio of PageView
  questionEditMode: formBuilderSelectMode.QUESTION_TYPE_LIST_VIEW,
  currentStep: 'select', // select, arrange, configure or publish
  status: 0 // 'unpublished' or 'published'
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

export const INIT_MAPPING_INFO_STATE = {
  type: formBuilderBoxMappingType.STANDARD,
  positions: {}
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
  // apiURL += '?access_code=1234'; // Temporary
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
export const receiveForm = createAction(RECEIVE_FORM, (data) => {
  const questions = data.form_data ? _.defaultTo(data.form_data.questions, []) : [];
  const logics = data.form_data ? _.defaultTo(data.form_data.logics, []) : [];
  return {
    id: data.id,
    status: data.status,
    questions,
    logics,
    documents: data.assets_urls ? data.assets_urls : [],
    documentMapping: data.document_mapping ? data.document_mapping : [],
    formConfig: data.form_config ? data.form_config : {},
    title: data.title,
    slug: data.slug,
    subdomain: data.subdomain,
    isModified: false,
    lastQuestionId: _.defaultTo(_.max(_.map(questions, 'id')), 0)
  };
});

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = createAction(DONE_FETCHING_FORM);

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id) => {
  return (dispatch, getState) => {
    dispatch(requestForm());
    dispatch(processFetchForm(id));
  };
};

// ------------------------------------
// Action: requestSubmitForm
// ------------------------------------
export const requestSubmitForm = createAction(REQUEST_FORM_SUBMIT);

// ------------------------------------
// Action: doneSubmitForm
// ------------------------------------
export const doneSubmitForm = createAction(DONE_FORM_SUBMIT);

// ------------------------------------
// Action: submitForm
// ------------------------------------
export const submitForm = () => {
  return (dispatch, getState) => {
    const formData = getState().formBuilder;
    dispatch(requestSubmitForm());
    dispatch(processSubmitForm(formData));
  };
};

// ------------------------------------
// Action: processSubmitForm
// ------------------------------------
export const processSubmitForm = (formData) => {
  var body = {
    'title': formData.title,
    // 'slug': formData.slug,
    'form_data': {
      'logics': formData.logics,
      'questions': formData.questions
    },
    'form_config': formData.formConfig,
    'document_mapping': formData.documentMapping
    // 'assets_urls': formData.documents
  };

  var method = 'POST';
  var requestURL = `${API_URL}/form_document/api/form/`;
  if (formData.id) {
    requestURL += `${formData.id}/`;
    method = 'PUT';
  }

  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const { id } = value;
      id && dispatch(updateFormId(id));
      dispatch(doneSubmitForm()); // Hide submitting spinner
      dispatch(setQuestionEditMode(formBuilderSelectMode.QUESTION_TYPE_LIST_VIEW));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitForm()); // Hide submitting spinner
      dispatch(setQuestionEditMode(formBuilderSelectMode.QUESTION_TYPE_LIST_VIEW));
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: saveForm
// ------------------------------------
export const saveForm = () => {
  return (dispatch, getState) => {
    dispatch(saveElement()); // Hide submitting spinner
    dispatch(submitForm());
  };
};

// ------------------------------------
// Action: updateFormId
// ------------------------------------
export const updateFormId = createAction(UPDATE_FORM_ID);

// ------------------------------------
// Action: saveElement
// ------------------------------------
export const saveElement = createAction(SAVE_ELEMENT);

// ------------------------------------
// Helper: _saveElement
// ------------------------------------
const _saveElement = (state, action) => {
  const { currentElement } = state;
  const id = currentElement.id ? currentElement.id : state.lastQuestionId + 1;
  var question = _.merge({}, INIT_QUESTION_STATE, currentElement.question, { id });
  // TODO: Update mappingInfo assignment
  var isModified = state.isModified || currentElement.isModified;
  return _.merge({}, state, {
    questions: mergeItemIntoArray(state.questions, question),
    documentMapping: _.merge({}, state.documentMapping, { [id]: currentElement.mappingInfo }),
    lastQuestionId: id,
    currentElement: _.merge({}, currentElement, { id }),
    isModified
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
    questionEditMode: false,
    currentElement: null,
    isModified: true
  });
};

// ------------------------------------
// Action: setQuestionInfo
// ------------------------------------
export const setQuestionInfo = createAction(SET_QUESTION_INFO);

// ------------------------------------
// Helper: _setQuestionInfo
// ------------------------------------
const _setQuestionInfo = (state, action) => {
  const question = _.get(state, ['currentElement', 'question'], {});
  return _updateCurrentElement(state, {
    question: Object.assign({}, question, action.payload)
  });
};

// ------------------------------------
// Action: resetQuestionInfo
// ------------------------------------
export const resetQuestionInfo = createAction(RESET_QUESTION_INFO);

// ------------------------------------
// Helper: _resetQuestionInfo
// ------------------------------------
const _resetQuestionInfo = (state, action) => {
  const question = _.get(state, ['currentElement', 'question'], {});
  return _updateCurrentElement(state, {
    question: Object.assign({}, _.omit(question, _.flatten([action.payload])))
  });
};

// ------------------------------------
// Action: setValidationInfo
// ------------------------------------
export const setValidationInfo = createAction(SET_VALIDATION_INFO);

// ------------------------------------
// Helper: _setValidationInfo
// ------------------------------------
const _setValidationInfo = (state, action) => {
  const currentValidations = _.get(state, [
    'currentElement', 'question', 'validations'
  ], []);
  const validation = _.pick(action.payload, ['type', 'value']);
  const validations = mergeItemIntoArray(currentValidations, validation, false, 'type');
  return _setQuestionInfo(state, {
    payload: { validations }
  });
};

// ------------------------------------
// Action: resetValidationInfo
// ------------------------------------
export const resetValidationInfo = createAction(RESET_VALIDATION_INFO);

// ------------------------------------
// Helper: _resetValidationInfo
// ------------------------------------
const _resetValidationInfo = (state, action) => {
  const currentValidations = _.get(state, [
    'currentElement', 'question', 'validations'
  ], []);
  const { type } = action.payload;
  const validations = _.differenceBy(currentValidations, [{type}], 'type');
  return _setQuestionInfo(state, {
    payload: { validations }
  });
};

// ------------------------------------
// Action: setMappingInfo
// ------------------------------------
export const setMappingInfo = createAction(SET_MAPPING_INFO);

// ------------------------------------
// Action: setMappingPositionInfo
// ------------------------------------
export const setMappingPositionInfo = createAction(SET_MAPPING_POSITION_INFO);

// ------------------------------------
// Helper: _setMappingPositionInfo
// ------------------------------------
const _setMappingPositionInfo = (state, action) => {
  const currentElement = _.assign({}, _.get(state, ['currentElement']));

  const { activeBoxPath, defaultMappingType } = currentElement;
  const activePathArray = _.defaultTo(_.split(activeBoxPath, '.'), []);

  const positionPathArray = _.concat(['mappingInfo'], activePathArray);
  const fields = _.isEqual(defaultMappingType, formBuilderBoxMappingType.STANDARD)
    ? ['box', 'font_size', 'page']
    : ['box', 'font_size', 'page', 'blocks'];
  let position = _.get(currentElement, positionPathArray, {});
  if (action.payload.blocks) {
    position = _.omit(position, ['blocks']);
  }
  const newPosition = _.merge(
    { 'font_size': formBuilderFontSize },
    position,
    _.pick(action.payload, fields)
  );
  _.set(currentElement, positionPathArray, newPosition);

  return _.assign({}, state, {
    currentElement
  });
};

// ------------------------------------
// Helper Action: _updateCurrentElement
// ------------------------------------
export const _updateCurrentElement = (state, element) => {
  return Object.assign({}, state, {
    currentElement: Object.assign({}, state.currentElement, element, {
      isModified: true
    })
  });
};

// ------------------------------------
// Action: setPageZoom
// ------------------------------------
export const setPageZoom = createAction(SET_PAGE_ZOOM);

// ------------------------------------
// Action: setQuestionEditMode
// ------------------------------------
export const setQuestionEditMode = createAction(SET_QUESTION_EDIT_MODE);

export const setCurrentElement = createAction(SET_CURRENT_ELEMENT);

export const setActiveBox = createAction(SET_ACTIVE_BOX);

const _setActiveBox = (state, action) => {
  const { currentElement } = state;
  const { mappingInfo } = currentElement;
  const activeBoxPath = action.payload || null;
  const pathArray = _.defaultTo(_.split(activeBoxPath, '.'), []);
  let newMappingInfo = mappingInfo;

  const intialMappingState = _.merge({}, INIT_MAPPING_INFO_STATE, {
    type: currentElement.defaultMappingType
  });

  if (!_.isNil(activeBoxPath)) {
    const label = pathArray[formBuilderPathIndex.LABEL];
    newMappingInfo = _.merge({
      [label]: intialMappingState
    }, mappingInfo);
  }

  return Object.assign({}, state, {
    currentElement: _.assign({}, state.currentElement, {
      activeBoxPath,
      mappingInfo: newMappingInfo
    })
  });
};

// ------------------------------------
// Action: setCurrentStep
// ------------------------------------
export const setCurrentStep = createAction(SET_CURRENT_STEP);

const _setCurrentElement = (state, action) => {
  const id = _.get(action, ['payload', 'id']);
  if (_.isNil(id)) { // If it's for creating a new question and mapping.
    return Object.assign({}, state, {
      currentElement: action.payload
    });
  } else { // If it's for loading from existing questions & mappings.
    const activeBoxPath = action.payload.activeBoxPath;
    const mappingInfo = state.documentMapping[id];
    const pathArray = _.defaultTo(_.split(activeBoxPath, '.'), []);
    const label = pathArray[formBuilderPathIndex.LABEL];
    return Object.assign({}, state, {
      currentElement: {
        id: action.payload.id,
        question: findItemById(state.questions, id),
        mappingInfo,
        activeBoxPath,
        isModified: false,
        defaultMappingType: mappingInfo[label].type
      }
    });
  }
};

// ------------------------------------
// Action: submitConfigureStep
// ------------------------------------
export const submitConfigureStep = (formData) => {
  var body = humps.decamelizeKeys(formData);
  var method = 'POST';
  var requestURL = `${API_URL}/form_document/api/form/`;
  if (formData.id && formData.id > 0) {
    requestURL += `${formData.id}/`;
    method = 'PUT';
  }
  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const { id } = value;
      id && dispatch(updateFormId(id));
      dispatch(doneSubmitForm());
      // update store
      dispatch(updateStore(formData));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitForm());
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};
// ------------------------------------
// Action: submitPublishStep
// ------------------------------------
export const submitPublishStep = (formData) => {
  // var body = humps.decamelizeKeys(formData);
  var body = formData;
  var method = 'POST';
  var requestURL = `${API_URL}/form_document/api/form/`;
  if (formData.id && formData.id > 0) {
    requestURL += `${formData.id}/`;
    method = 'PUT';
  }
  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const { id } = value;
      id && dispatch(updateFormId(id));
      dispatch(doneSubmitForm());
      // TODO: success message?
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitForm());
      // TODO: error message?
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};
// ------------------------------------
// Action: updateStore
// ------------------------------------
export const updateStore = createAction(UPDATE_STORE);

// ------------------------------------
// Action: setFormStatus
// ------------------------------------
export const setFormStatus = createAction(SET_FORM_STATUS);
const _setFormStatus = (state, action) => {
  return Object.assign({}, state, {
    status: action.payload
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
      isFetching: false,
      isModified: false
    }),

  REQUEST_FORM_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: true
    }),

  DONE_FORM_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: false
    }),

  UPDATE_FORM_ID: (state, action) =>
    Object.assign({}, state, {
      id: parseInt(action.payload)
    }),

  SET_FORM_STATUS: (state, action) =>
    _setFormStatus(state, action),

  UPDATE_STORE: (state, action) =>
    Object.assign({}, state, action.payload),

  SAVE_ELEMENT: (state, action) =>
    _saveElement(state, action),

  DELETE_ELEMENT: (state, action) =>
    _deleteElement(state, action),

  SET_QUESTION_INFO: (state, action) =>
    _setQuestionInfo(state, action),

  RESET_QUESTION_INFO: (state, action) =>
    _resetQuestionInfo(state, action),

  SET_MAPPING_INFO: (state, action) =>
    _updateCurrentElement(state, {
      mappingInfo: Object.assign({}, action.payload)
    }),

  SET_MAPPING_POSITION_INFO: (state, action) =>
    _setMappingPositionInfo(state, action),

  SET_VALIDATION_INFO: (state, action) =>
    _setValidationInfo(state, action),

  RESET_VALIDATION_INFO: (state, action) =>
    _resetValidationInfo(state, action),

  SET_PAGE_ZOOM: (state, action) =>
    Object.assign({}, state, {
      pageZoom: action.payload
    }),

  SET_CURRENT_STEP: (state, action) =>
    Object.assign({}, state, {
      currentStep: action.payload
    }),

  SET_QUESTION_EDIT_MODE: (state, action) =>
    Object.assign({}, state, {
      questionEditMode: action.payload
    }),

  SET_CURRENT_ELEMENT: (state, action) =>
    _setCurrentElement(state, action),

  SET_ACTIVE_BOX: (state, action) =>
    _setActiveBox(state, action)

}, INIT_BUILDER_STATE);

export default formBuilderReducer;
