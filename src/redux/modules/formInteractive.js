import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { findItemById, mergeItemIntoArray, removeItemFromArray } from 'helpers/pureFunctions';
import { createAction, handleActions } from 'redux-actions';
import { getNextQuestionId, getOutcomeWithQuestionId } from 'helpers/formInteractiveHelper';
import { assignDefaults } from 'redux/utils/request';
import _ from 'lodash';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';

export const RECEIVE_ANSWERS = 'RECEIVE_ANSWERS';
export const REQUEST_ANSWERS = 'REQUEST_ANSWERS';
export const DONE_FETCHING_ANSWERS = 'DONE_FETCHING_ANSWERS';

export const CHANGE_CURRENT_ANSWER = 'CHANGE_CURRENT_ANSWER';

export const GOTO_QUESTION = 'GOTO_QUESTION';
export const STORE_ANSWER = 'STORE_ANSWER';

export const ANSWER_PREFILL = 'ANSWER_PREFILL';

export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';

export const SHOW_FINAL_SUBMIT = 'SHOW_FINAL_SUBMIT';
export const SET_INPUT_LOCKED = 'SET_INPUT_LOCKED';

export const RESET_FORM_SUBMIT_STATUS = 'RESET_FORM_SUBMIT_STATUS';

export const SET_ID_VERIFY_STATUS = 'SET_ID_VERIFY_STATUS';

export const SEND_CONTINUE_LINK = 'SEND_CONTINUE_LINK';
export const REQUEST_SEND_CONTINUE_LINK = 'REQUEST_SEND_CONTINUE_LINK';
export const DONE_SENDING_CONTINUE_LINK = 'DONE_SENDING_CONTINUE_LINK';

// ------------------------------------
// Form submit request action Constants
// ------------------------------------
export const FORM_USER_SUBMISSION = 'FORM_USER_SUBMISSION';
export const FORM_AUTOSAVE = 'FORM_AUTOSAVE';
export const UPDATE_ACCESS_CODE = 'UPDATE_ACCESS_CODE';

export const INIT_CURRENT_QUESTION = {
  id: 0,
  answerValue: ''
};

// TODO: Implement the structure of form_config field.
const INIT_FORM_CONFIG = {
  idVerification: {
    isRequired: true
  }
};

// TODO: Implement how to get people data.
const TEST_PEOPLE_DATA = [
  {
    first_name: 'Jordan',
    last_name: 'McCown',
    status: 'PENDING',
    id: '9b6a957c-85ad-45dd-9c5f-6873ffea8d15', // TODO: implement how to get this id required for Upload
    selected: false
  },
  {
    first_name: 'George',
    last_name: 'Gregory',
    status: 'PENDING',
    id: '9b6a957c-85ad-45dd-9c5f-6873ffea8d15', // TODO: implement how to get this id required for Upload
    selected: false
  },
  {
    first_name: 'Lihan',
    last_name: 'Li',
    status: 'VERIFIED',
    id: '9b6a957c-85ad-45dd-9c5f-6873ffea8d15', // TODO: implement how to get this id required for Upload
    selected: false
  }
];

export const INIT_FORM_STATE = {
  id: 0,
  // sessionId,
  isFetchingForm: false, // indicates the form request is being processed.
  isFetchingAnswers: false, // indicates the form answers are being fetched.
  isSubmitting: false, // indicates the form answers submission is being processed.
  isModified: false, // indicates the form answer modified after submission.
  lastUpdated: Date.now(), // last form-questions received time.
  isSendingContinueLink: false,
  sendContinueLinkResponse: null,
  form: {
    questions: [],
    logics: []
  }, // holds the received form data.
  formConfig: INIT_FORM_CONFIG,
  title: 'Title',
  slug: 'slug',
  currentQuestion: INIT_CURRENT_QUESTION,
  isInputLocked: false,
  answers: [],
  prefills: [],
  verificationStatus: [],
  primaryColour: '#3191d2',
  shouldShowFinalSubmit: false, // indicates whether to show final form submit section.
  formAccessStatus: 'init', // can be 'init', 'waiting', 'failed', 'success'
  isAccessCodeProtected: false,
  numberOfPages: 0,
  formAccessCode: '',
  idVerifyStatus: {
    people: TEST_PEOPLE_DATA, // people data
    step: 'SELECT_PEOPLE', // can be 'SELECT_PEOPLE', 'SELECT_METHOD', 'VERIFY'
    index: 0 // index of people field, used in step 'VERIFY'
  }
};

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (formIdSlug, accessCode) => {
  var apiURL = `${API_URL}/form_document/api/form_retrieval/${formIdSlug}/`;
  if (accessCode.length > 0) {
    apiURL += `?access_code=${accessCode}`;
  }
  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(value));
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
// Action: setInputLocked
// ------------------------------------
export const setInputLocked = createAction(SET_INPUT_LOCKED);

// ------------------------------------
// Action: requestForm
// ------------------------------------
export const requestForm = createAction(REQUEST_FORM);

// ------------------------------------
// Action: receiveForm
// ------------------------------------
export const receiveForm = createAction(RECEIVE_FORM, (data) => ({
  id: data.id,
  form: data.form_data,
  title: data.title,
  slug: data.slug,
  isAccessCodeProtected: data.is_access_code_protected,
  numberOfPages: data.number_of_pages
}));

// ------------------------------------
// Action Handler: _receiveForm
// ------------------------------------
const _receiveForm = (state, { payload }) => {
  const id = _validateQuestionId(payload.form);
  const allQuestions = payload.form.questions;
  const prefilledAnswers = allQuestions
    .filter(question => Boolean(question.value) === true) // All questions with prefills
    .map(question => ({id: question.id, value: question.value}));

  const currentQuestionAnswer = findItemById(prefilledAnswers, id);
  const currentQuestion = Object.assign({}, state.currentQuestion, {
    id,
    answerValue: _.get(currentQuestionAnswer, 'value', null)
  });
  return Object.assign({}, state, payload, {
    answers: prefilledAnswers,
    lastUpdated: Date.now(),
    currentQuestion: currentQuestion,
    formAccessStatus: !payload.form ? (state.formAccessStatus === 'init' ? 'required' : 'fail') : 'success'
  });
};

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = createAction(DONE_FETCHING_FORM);

// ------------------------------------
// Action Handler: shouldFetchForm
// ------------------------------------
const shouldFetchForm = (formInteractive, formIdSlug) => {
  /*
   * We should fetch form if
   * - if form is not being loaded
   * - it should load another form
   * - no form_data has loaded
   */
  if (formInteractive.isFetchingForm) return false;
  if (formIdSlug !== formInteractive.id && formIdSlug !== formInteractive.slug) return true;
  if (!formInteractive.form) return true;
  return false;
};

// ------------------------------------
// Action: fetchFormIfNeeded
// ------------------------------------
export const fetchFormIfNeeded = (formIdSlug) => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    if (shouldFetchForm(formInteractive, formIdSlug)) {
      dispatch(requestForm());
      dispatch(fetchForm(formIdSlug, formInteractive.formAccessCode));
    } else {
      // dispatch(fetchAnswers());
    }
  };
};

// ------------------------------------
// Action: fetchAnswers
// ------------------------------------
export const fetchAnswers = (sessionId) => {
  return (dispatch, getState) => {
    dispatch(requestAnswers());
    dispatch(processFetchAnswers(sessionId));
  };
};

// ------------------------------------
// Action: requestAnswers
// ------------------------------------
export const requestAnswers = createAction(REQUEST_ANSWERS);

// ------------------------------------
// Action: receiveAnswers
// ------------------------------------
export const receiveAnswers = createAction(RECEIVE_ANSWERS, (data) => ({
  sessionId: data.response_id,
  answers: data.answers
}));

// ------------------------------------
// Action Handler: _receiveAnswers
// ------------------------------------
const _receiveAnswers = (state, { payload }) => {
  return Object.assign({}, state, payload, {
    currentQuestion: _.merge({}, state.currentQuestion, {
      answerValue: _.defaultTo(findItemById(payload.answers, state.currentQuestion.id), {}).value
    })
  });
};

// ------------------------------------
// Action: doneFetchingAnswers
// ------------------------------------
export const doneFetchingAnswers = createAction(DONE_FETCHING_ANSWERS);

// ------------------------------------
// Action Action Handler: processFetchAnswers
// ------------------------------------
export const processFetchAnswers = (sessionId) => {
  const apiURL = `${API_URL}/form_document/api/form_response/${sessionId}/`;

  const fetchParams = assignDefaults();

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveAnswers(value));
      dispatch(doneFetchingAnswers()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingAnswers()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action Handler: _validateQuestionId
// ------------------------------------
const _validateQuestionId = (form) => {
  if (!form) return 0;
  const questions = form.questions;
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].type !== 'Group') return questions[i].id;
  }
  return 1;
};

// ------------------------------------
// Action: goToQuestion
// ------------------------------------
export const goToQuestion = createAction(GOTO_QUESTION, (id) => id);

// ------------------------------------
// Action Handler: _loadQuestion
// ------------------------------------
const _loadQuestion = (state, action) => {
  const { answers } = state;
  return Object.assign({}, state, {
    currentQuestion: {
      id: action.payload,
      answerValue: _.defaultTo(findItemById(answers, action.payload), {}).value
    },
    shouldShowFinalSubmit: false
  });
};

// ------------------------------------
// Action: changeCurrentState
// ------------------------------------
export const changeCurrentState = createAction(CHANGE_CURRENT_ANSWER);

// ------------------------------------
// Action: goToNextQuestion
// ------------------------------------
export const goToNextQuestion = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestion } = formInteractive;
    var nextId = getNextQuestionId(questions, currentQuestion.id);
    if (nextId === currentQuestion.id) { // detect the last question
      return dispatch(showFinalSubmit());
    }

    const outcome = getOutcomeWithQuestionId(formInteractive, currentQuestion.id);
    if (outcome !== false) {
      for (var item of outcome) {
        // Processes outcome before going to next question
        if (item.type === 'JumpToQuestion') {
          nextId = item.value;
        } else if (item.type === 'AnswerPrefill') {
          dispatch(answerPrefill({
            id: item.source_field,
            value: item.value
          }));
        }
      }
    }
    dispatch(goToQuestion(nextId));
  };
};

// ------------------------------------
// Action: updateAccessCode
// ------------------------------------
export const updateAccessCode = createAction(UPDATE_ACCESS_CODE);

// ------------------------------------
// Action: showFinalSubmit
// ------------------------------------
export const showFinalSubmit = createAction(SHOW_FINAL_SUBMIT);

// ------------------------------------
// Action: goToPrevQuestion
// ------------------------------------
export const goToPrevQuestion = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestion } = formInteractive;
    const prevId = _getPrevQuestionId(questions, currentQuestion.id);
    dispatch(goToQuestion(prevId));
  };
};

// ------------------------------------
// Action Handler: _getPrevQuestionId
// ------------------------------------
const _getPrevQuestionId = (questions, questionId) => {
  const questionsNoGroup = questions.filter(question => question.type.toLowerCase() !== 'group');
  const questionIndex = questionsNoGroup.findIndex(question => question.id === questionId);
  const consolidatedIndex = Math.max(0, questionIndex-1);
  return questions[consolidatedIndex].id;
};

// ------------------------------------
// Action: storeAnswer
// ------------------------------------
export const storeAnswer = createAction(STORE_ANSWER, ({ id, value }) => ({
  id,
  value
}));

// ------------------------------------
// Action: answerPrefill
// ------------------------------------
export const answerPrefill = createAction(ANSWER_PREFILL, ({ id, value }) => ({
  id,
  value
}));

// ------------------------------------
// Action: handleEnter
// ------------------------------------
export const handleEnter = () => {
  return (dispatch, getState) => {
    dispatch(goToNextQuestion());
  };
};

// ------------------------------------
// Action: submitAnswer
// ------------------------------------
export const submitAnswer = (requestAction, onSuccess) => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;

    if (requestAction === FORM_USER_SUBMISSION) {
      dispatch(requestSubmitAnswer());
      dispatch(processSubmitAnswer(requestAction, formInteractive, onSuccess));
    }
    if (requestAction === FORM_AUTOSAVE) {
      dispatch(processSubmitAnswer(requestAction, formInteractive, onSuccess));
    }
  };
};

// ------------------------------------
// Action: requestSubmitAnswer
// ------------------------------------
export const requestSubmitAnswer = createAction(REQUEST_SUBMIT);

// ------------------------------------
// Action: processSubmitAnswer
// ------------------------------------
export const processSubmitAnswer = (requestAction, formInteractive, onSuccess) => {
  const { id, answers, sessionId } = formInteractive;
  var body = {
    request_action: requestAction,
    answers: answers,
    form_id: id,
    session_id: sessionId
  };

  var method = 'POST';
  var requestURL = `${API_URL}/form_document/api/form_response/`;
  if (sessionId) {
    requestURL += `${sessionId}/`;
    method = 'PUT';
  }

  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const { response_id } = value;
      dispatch(updateSessionId(response_id));
      dispatch(doneSubmitAnswer({
        result: true,
        requestAction
      })); // Hide submitting spinner
      onSuccess && onSuccess({
        sessionId: response_id,
        requestAction: requestAction
      });
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitAnswer({
        result: false,
        requestAction
      })); // Hide submitting spinner
    };
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Action: doneSubmitAnswer
// ------------------------------------
export const doneSubmitAnswer = createAction(DONE_SUBMIT, (status) => status);

// ------------------------------------
// Action: updateFormSession
// ------------------------------------
export const updateSessionId = createAction(UPDATE_SESSION_ID);

// ------------------------------------
// Action: setIDVerifyStatus
// ------------------------------------
export const setIDVerifyStatus = createAction(SET_ID_VERIFY_STATUS);

// ------------------------------------
// Action: sendContinueLink
// ------------------------------------
export const sendContinueLink = (sessionId, email, formContinueUrl) => {
  return (dispatch, getState) => {
    dispatch(requestSendContinueLink());
    dispatch(processSendContinueLink(sessionId, email, formContinueUrl));
  };
};
// ------------------------------------
// Actions: requestSendContinueLink, doneSendingContinueLink
// ------------------------------------
export const requestSendContinueLink = createAction(REQUEST_SEND_CONTINUE_LINK);
export const doneSendingContinueLink = createAction(DONE_SENDING_CONTINUE_LINK);
// ------------------------------------
// Action Action Handler: processSendContinueLink
// ------------------------------------
export const processSendContinueLink = (sessionId, email, formContinueUrl) => {
  const apiURL = `${API_URL}/form_document/api/form_response/send_resume_link/`;

  var method = 'POST';
  var body = {
    response_id: sessionId,
    email: email,
    form_continue_url: formContinueUrl
  };
  const fetchParams = assignDefaults({
    method,
    body
  });

  const fetchSuccess = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSendingContinueLink(data.value));
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSendingContinueLink(data.value));
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Reducer
// ------------------------------------
const formInteractiveReducer = handleActions({
  RECEIVE_FORM: (state, action) =>
    _receiveForm(state, action),

  REQUEST_FORM: (state, action) =>
    Object.assign({}, state, {
      isFetchingForm: true,
      formAccessStatus: 'waiting'
    }),

  DONE_FETCHING_FORM: (state, action) =>
    Object.assign({}, state, {
      isFetchingForm: false
    }),

  RECEIVE_ANSWERS: (state, action) =>
    _receiveAnswers(state, action),

  REQUEST_ANSWERS: (state, action) =>
    Object.assign({}, state, {
      isFetchingAnswers: true
    }),

  DONE_FETCHING_ANSWERS: (state, action) =>
    Object.assign({}, state, {
      isFetchingAnswers: false
    }),

  GOTO_QUESTION: (state, action) =>
    _loadQuestion(state, action),

  ANSWER_PREFILL: (state, action) =>
    Object.assign({}, state, {
      prefills: mergeItemIntoArray(state.prefills, action.payload)
    }),

  CHANGE_CURRENT_ANSWER: (state, action) =>
    Object.assign({}, state, {
      currentQuestion: Object.assign({}, state.currentQuestion, action.payload),
      verificationStatus: removeItemFromArray(state.verificationStatus, {id: state.currentQuestion.id})
    }),

  SET_INPUT_LOCKED: (state, action) =>
    Object.assign({}, state, {
      isInputLocked: action.payload
    }),

  STORE_ANSWER: (state, action) => {
    var State = Object.assign({}, state, {
      answers: mergeItemIntoArray(state.answers, action.payload),
      isModified: true
    });
    return State;
  },

  UPDATE_SESSION_ID: (state, action) =>
    Object.assign({}, state, {
      sessionId: action.payload
    }),

  REQUEST_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: true
    }),

  DONE_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      isSubmitting: false,
      isModified: action.payload.result ? false : state.isModified
    }),

  SHOW_FINAL_SUBMIT: (state, action) =>
    Object.assign({}, state, {
      shouldShowFinalSubmit: true
    }),

  UPDATE_ACCESS_CODE: (state, action) =>
    Object.assign({}, state, {
      formAccessCode: action.payload
    }),

  SET_ID_VERIFY_STATUS: (state, action) =>
    Object.assign({}, state, {
      idVerifyStatus: Object.assign({}, state.idVerifyStatus, action.payload)
    }),

  REQUEST_SEND_CONTINUE_LINK: (state, action) =>
    Object.assign({}, state, {
      isSendingContinueLink: true,
      sendContinueLinkResponse: null
    }),

  DONE_SENDING_CONTINUE_LINK: (state, action) =>
    Object.assign({}, state, {
      isSendingContinueLink: false,
      sendContinueLinkResponse: action.payload
    })

}, INIT_FORM_STATE);

export default formInteractiveReducer;
