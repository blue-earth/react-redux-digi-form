import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { findIndexById, findItemById, mergeItemIntoArray } from 'helpers/pureFunctions';
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
export const VERIFY_EMAIL = 'VERIFY_EMAIL';

export const REQUEST_VERIFICATION = 'REQUEST_VERIFICATION';
export const DONE_VERIFICATION = 'DONE_VERIFICATION';
export const RECEIVE_VERIFICATION = 'RECEIVE_VERIFICATION';

export const REQUEST_SUBMIT = 'REQUEST_SUBMIT';
export const DONE_SUBMIT = 'DONE_SUBMIT';
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';

export const SHOW_FINAL_SUBMIT = 'SHOW_FINAL_SUBMIT';

export const RESET_FORM_SUBMIT_STATUS = 'RESET_FORM_SUBMIT_STATUS';

export const SET_ID_VERIFY_STATUS = 'SET_ID_VERIFY_STATUS';

// ------------------------------------
// Form submit request action Constants
// ------------------------------------
export const FORM_USER_SUBMISSION = 'FORM_USER_SUBMISSION';
export const FORM_AUTOSAVE = 'FORM_AUTOSAVE';
export const UPDATE_ACCESS_CODE = 'UPDATE_ACCESS_CODE';

export const INIT_CURRENT_QUESTION = {
  id: 0,
  answerValue: '',
  inputState: 'init'
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
    id: 1,
    selected: false
  },
  {
    first_name: 'George',
    last_name: 'Gregory',
    status: 'PENDING',
    id: 2,
    selected: false
  },
  {
    first_name: 'Lihan',
    last_name: 'Li',
    status: 'VERIFIED',
    id: 3,
    selected: false
  }
];

export const INIT_FORM_STATE = {
  id: 0,
  // sessionId,
  isFetchingForm: false, // indicates the form request is being processed.
  isFetchingAnswers: false, // indicates the form answers are being fetched.
  isSubmitting: false, // indicates the form answers submission is being processed.
  isVerifying: false, // indicates the verifying request is being processed.
  isModified: false, // indicates the form answer modified after submission.
  lastUpdated: Date.now(), // last form-questions received time.
  form: {
    questions: [],
    logics: []
  }, // holds the received form data.
  formConfig: INIT_FORM_CONFIG,
  title: 'Title',
  slug: 'slug',
  currentQuestion: INIT_CURRENT_QUESTION,
  answers: [],
  prefills: [],
  verificationStatus: [],
  primaryColour: '#3191d2',
  shouldShowFinalSubmit: false, // indicates whether to show final form submit section.
  formAccessStatus: 'init', // can be 'init', 'waiting', 'failed', 'success'
  isAccessCodeProtected: false,
  formAccessCode: '',
  idVerifyStatus: {
    people: TEST_PEOPLE_DATA, // people data
    step: 'SELECT_PEOPLE' // can be 'SELECT_PEOPLE', 'SELECT_METHOD', 'VERIFY'
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
  isAccessCodeProtected: data.is_access_code_protected
}));

// ------------------------------------
// Action Handler: _receiveForm
// ------------------------------------
const _receiveForm = (state, { payload }) => {
  const id = _validateQuestionId(payload.form);
  return Object.assign({}, state, payload, {
    lastUpdated: Date.now(),
    currentQuestion: _.merge({}, state.currentQuestion, {
      id,
      answerValue: _.defaultTo(findItemById(state.answers, id), {}).value
    }),
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
      answerValue: _.defaultTo(findItemById(answers, action.payload), {}).value,
      inputState: 'init'
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
  var curIdx, prevIdx;
  curIdx = prevIdx = _.findIndex(questions, function (o) { return o.id === questionId; });
  while (prevIdx > 1) {
    var q = questions[--prevIdx];
    if (q.type !== 'Group') break;
  }
  if (questions[prevIdx].type === 'Group') prevIdx = curIdx; // In case it reaches index 0 and question type is 'Group'
  return questions[prevIdx].id;
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
// Action: verifyEmail
// ------------------------------------
export const verifyEmail = (questionId, email) => {
  return (dispatch, getState) => {
    // if (!getState().isVerifying) {
    dispatch(requestVerification());
    dispatch(processVerifyEmail(questionId, email));
    // }
  };
};

// ------------------------------------
// Action: requestVerification
// ------------------------------------
export const requestVerification = createAction(REQUEST_VERIFICATION);

// ------------------------------------
// Action: processVerifyEmail
// ------------------------------------
export const processVerifyEmail = (questionId, email) => {
  const apiURL = `${API_URL}/verifications/api/email/verify/`;
  const body = { email };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value: {result}}) => {
    return (dispatch, getState) => {
      dispatch(receiveVerification({
        id: questionId,
        type: 'EmondoEmailFieldService',
        status: result
      }));
      dispatch(doneVerification()); // Hide loading spinner
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(receiveVerification({
        id: questionId,
        type: 'EmondoEmailFieldService',
        status: false
      }));
      dispatch(doneVerification()); // Hide loading spinner
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// const shouldVerifyEmail = (state, id) => {
//   const { formInteractive: { form: { questions } } } = state;
//   const idx = findIndexById(questions, id);

//   if (_.indexOf(questions[idx].verifications, 'EmondoEmailFieldService') != -1)
//     return true;
//   else
//     return false;
// }

const shouldVerify = (formInteractive) => {
  const { form: { questions }, currentQuestion } = formInteractive;
  const idx = findIndexById(questions, currentQuestion.id);
  if (typeof questions[idx].verifications !== 'undefined' && questions[idx].verifications.length > 0) {
    return true;
  } else {
    return false;
  }
};

// ------------------------------------
// Action: nextQuestionAfterVerification
// ------------------------------------
export const nextQuestionAfterVerification = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestion, answers } = formInteractive;
    const idx = findIndexById(questions, currentQuestion.id);

    dispatch(requestVerification());
    for (var verification of questions[idx].verifications) {
      if (verification === 'EmondoEmailFieldService') {
        const answerIndex = findIndexById(answers, currentQuestion.id);
        dispatch(verifyEmail(currentQuestion.id, answers[answerIndex].value));
      }
    }
  };
};

const doneVerification = createAction(DONE_VERIFICATION);

// ------------------------------------
// Action: receiveVerification
// ------------------------------------
export const receiveVerification = (verification) => {
  return (dispatch, getState) => {
    dispatch(updateVerificationStatus(verification));
    const formInteractive = getState().formInteractive;
    const { verificationStatus, currentQuestion, form: { questions } } = formInteractive;
    const verifiedStatuses = _.filter(verificationStatus, {id: currentQuestion.id, status: true});
    const idx = findIndexById(questions, currentQuestion.id);
    // If all verified as true go to next question.
    if (verifiedStatuses.length === questions[idx].verifications.length) {
      dispatch(goToNextQuestion());
    }
  };
};

// ------------------------------------
// Action: updateVerificationStatus
// ------------------------------------
export const updateVerificationStatus = createAction(RECEIVE_VERIFICATION);

// ------------------------------------
// Action: handleEnter
// ------------------------------------
export const handleEnter = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    // check if verification is required.
    if (shouldVerify(formInteractive)) {
      dispatch(nextQuestionAfterVerification());
    } else {
      dispatch(goToNextQuestion());
    }
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
    if (requestAction === FORM_AUTOSAVE && formInteractive.isModified) {
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
      currentQuestion: Object.assign({}, state.currentQuestion, action.payload)
    }),
  STORE_ANSWER: (state, action) =>
    Object.assign({}, state, {
      answers: mergeItemIntoArray(state.answers, action.payload),
      isModified: true
    }),

  REQUEST_VERIFICATION: (state, action) =>
    Object.assign({}, state, {
      isVerifying: true
    }),

  DONE_VERIFICATION: (state, action) =>
    Object.assign({}, state, {
      isVerifying: false
    }),

  RECEIVE_VERIFICATION: (state, action) =>
    Object.assign({}, state, {
      verificationStatus: mergeItemIntoArray(state.verificationStatus, action.payload)
    }),

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
    })

}, INIT_FORM_STATE);

export default formInteractiveReducer;
