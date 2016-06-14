import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { findIndexById, mergeItemIntoArray } from 'helpers/pureFunctions';
import { getOutcomeWithQuestionId } from 'helpers/formInteractiveHelper';
import _ from 'lodash';

// ------------------------------------
// Action type Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM';
export const REQUEST_FORM = 'REQUEST_FORM';
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM';
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

// ------------------------------------
// Form submit request action Constants
// ------------------------------------
export const FORM_USER_SUBMISSION = 'FORM_USER_SUBMISSION';
export const FORM_AUTOSAVE = 'FORM_AUTOSAVE';

export const INIT_FORM_STATE = {
  id: 0,
  // sessionId,
  isFetching: false, // indicates the form request is being processed.
  isSubmitting: false, // indicates the form submission is being processed.
  isVerifying: false, // indicates the verifying request is being processed.
  isModified: false, // indicates the form answer modified after submission.
  lastUpdated: Date.now(), // last form-questions received time.
  lastFormSubmitStatus: {}, // holds the status of last form submit response.
  form: {
    questions: [],
    logics:[]
  }, // holds the received form data.
  title: 'Title',
  slug: 'slug',
  currentQuestionId: 0,
  answers: [],
  prefills: [],
  verificationStatus:[],
  primaryColor: '#DD4814'
};

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id, sessionId) => {
  const fetchParams = {
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json'
    },
    redirect: 'follow',
    method: 'GET'
  };

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(value));
      dispatch(doneFetchingForm()); // Hide loading spinner
      if (sessionId)
        dispatch(updateSessionId(sessionId)); // Temporary, Should be updated.
    }
  };
  
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneFetchingForm()); // Hide loading spinner
    }
  };

  return bind(fetch(`${API_URL}/form_document/api/form/${id}`, fetchParams), fetchSuccess, fetchFail);
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
export const receiveForm = (data) => {
  return {
    type: RECEIVE_FORM,
    id: data.id,
    form: data.form_data,
    title: data.title,
    slug: data.slug,
    receivedAt: Date.now(),
    sessionId: data.session_id,
    currentQuestionId: validateQuestionId(data.form_data)
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

const shouldFetchForm = (state, id) => {
  const formInteractive = state.formInteractive;
  if (id !== formInteractive.id && !formInteractive.isFetching) {
    return true;
  } else {
    return false;
  }
}

// ------------------------------------
// Action: fetchFormIfNeeded
// ------------------------------------
export const fetchFormIfNeeded = (id, sessionId) => {
  return (dispatch, getState) => {
    if (shouldFetchForm(getState(), id)) {
      dispatch(requestForm());
      dispatch(fetchForm(id, sessionId));
    }
  }
}

const validateQuestionId = (form) => {
  const questions = form.questions;
  for ( var i = 0; i < questions.length; i ++ ) {
    if (questions[i].type !== 'Group') return questions[i].id;
  }
  return 1;
}

// ------------------------------------
// Action: goToQuestion
// ------------------------------------
export const goToQuestion = (id) => {
  return {
    type: GOTO_QUESTION,
    id: id
  }
}

// ------------------------------------
// Action: nextQuestion
// ------------------------------------
export const nextQuestion = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestionId } = formInteractive;
    var nextId = getNextQuestionId(questions, currentQuestionId);
    const outcome = getOutcomeWithQuestionId(formInteractive, currentQuestionId);
    if ( outcome !== false ) {
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
  }
}

const getNextQuestionId = (questions, questionId) => {
  var curIdx, nextIdx;
  curIdx = nextIdx = _.findIndex(questions, function(o) { return o.id == questionId; })
  while ( nextIdx < questions.length - 1 ) { 
    var q = questions[++nextIdx];
    if (q.type != 'Group') break;
  }
  if (questions[nextIdx].type == 'Group') nextIdx = curIdx;
  return questions[nextIdx].id;
}

// ------------------------------------
// Action: prevQuestion
// ------------------------------------
export const prevQuestion = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestionId } = formInteractive;
    const prevId = getPrevQuestionId(questions, currentQuestionId);
    dispatch(goToQuestion(prevId));
  }
}

const getPrevQuestionId = (questions, questionId) => {
  var curIdx, prevIdx;
  curIdx = prevIdx = _.findIndex(questions, function(o) { return o.id == questionId; });
  while ( prevIdx > 1 ) { 
    var q = questions[--prevIdx];
    if (q.type != 'Group') break;
  }
  if (questions[prevIdx].type == 'Group') prevIdx = curIdx; //In case it reaches index 0 and question type is 'Group'
  return questions[prevIdx].id;
}

// ------------------------------------
// Action: storeAnswer
// ------------------------------------
export const storeAnswer = ({id, value}) => {
  return (dispatch, getState) => {
    const state = getState();
    // if ( shouldVerifyEmail(state, id) ) {
    //   dispatch(verifyEmail(id, value));
    // }
    dispatch(processStoreAnswer({id, value}));
  }
}

// ------------------------------------
// Action: processStoreAnswer
// ------------------------------------
export const processStoreAnswer = ({id, value}) => {
  return {
    type: STORE_ANSWER,
    answer: {
      id,
      value
    }
  };
}

// ------------------------------------
// Action: answerPrefill
// ------------------------------------
export const answerPrefill = ({id, value}) => {
  return {
    type: ANSWER_PREFILL,
    prefill: {
      id,
      value
    }
  };
}

// ------------------------------------
// Action: verifyEmail
// ------------------------------------
export const verifyEmail = (questionId, email) => {
  return (dispatch, getState) => {
    //if (!getState().isVerifying) {
      dispatch(requestVerification());
      dispatch(processVerifyEmail(questionId, email));
    //}
  };
}

// ------------------------------------
// Action: requestVerification
// ------------------------------------
export const requestVerification = () => {
  return {
    type: REQUEST_VERIFICATION
  };
}

// ------------------------------------
// Action: processVerifyEmail
// ------------------------------------
export const processVerifyEmail = (questionId, email) => {

  const fetchParams = {
    method: 'POST',
    headers: {
      // Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email
    })
  };

  const fetchSuccess = ({value: {result}}) => {
    return (dispatch, getState) => {
      dispatch(receiveVerification({
        id: questionId,
        type: 'EmondoEmailFieldService',
        status: result
      }));
      dispatch(doneVerification()); // Hide loading spinner
    }
  };
  
  const fetchFail = (data) => {
    dispatch(receiveVerification({
      id: questionId,
      type: 'EmondoEmailFieldService',
      status: false
    }));
    dispatch(doneVerification()); // Hide loading spinner
  };

  return bind(fetch(`${API_URL}/verifications/api/email/verify/`, fetchParams), fetchSuccess, fetchFail);
}

// const shouldVerifyEmail = (state, id) => {
//   const { formInteractive: { form: { questions } } } = state;
//   const idx = findIndexById(questions, id);

//   if (_.indexOf(questions[idx].verifications, 'EmondoEmailFieldService') != -1)
//     return true;
//   else
//     return false;
// }

const shouldVerify = (formInteractive) => {
  const { form: { questions }, currentQuestionId } = formInteractive;
  const idx = findIndexById(questions, currentQuestionId);
  if (typeof questions[idx].verifications !== 'undefined' && questions[idx].verifications.length > 0)
    return true;
  else
    return false;
}

// ------------------------------------
// Action: nextQuestionAfterVerification
// ------------------------------------
export const nextQuestionAfterVerification = () => {

  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    const { form: { questions }, currentQuestionId, answers } = formInteractive;
    const idx = findIndexById(questions, currentQuestionId);

    dispatch(requestVerification());
    for (var verification of questions[idx].verifications) {
      if (verification === 'EmondoEmailFieldService') {
        const answerIndex = findIndexById(answers, currentQuestionId);
        dispatch(verifyEmail(currentQuestionId, answers[answerIndex].value));
      }
    }
  }
}

const doneVerification = () => {
  return {
    type: DONE_VERIFICATION
  };
}

// ------------------------------------
// Action: receiveVerification
// ------------------------------------
export const receiveVerification = (verification) => {
  return (dispatch, getState) => {
    dispatch(updateVerificationStatus(verification));
    const formInteractive = getState().formInteractive;
    const { verificationStatus, currentQuestionId, form: { questions } } = formInteractive;
    const verifiedStatuses = _.filter(verificationStatus, {id: currentQuestionId, status: true});
    const idx = findIndexById(questions, currentQuestionId);
    // If all verified as true go to next question.
    if (verifiedStatuses.length == questions[idx].verifications.length) {
      dispatch(nextQuestion());
    }
  };
}

// ------------------------------------
// Action: updateVerificationStatus
// ------------------------------------
export const updateVerificationStatus = (verification) => {
  return {
    type: RECEIVE_VERIFICATION,
    verification: verification
  };
}

// ------------------------------------
// Action: handleEnter
// ------------------------------------
export const handleEnter = () => {
  return (dispatch, getState) => {
    const formInteractive = getState().formInteractive;
    // check if verification is required.
    if ( shouldVerify(formInteractive) ) {
      dispatch(nextQuestionAfterVerification());
      //dispatch(verifyEmail(currentQuestionId, answers[currentQuestionId].value));
    } else {
      dispatch(nextQuestion())
    }
  };
}

// ------------------------------------
// Action: submitAnswer
// ------------------------------------
export const submitAnswer = (requestAction) => {
  return (dispatch, getState) => {
      const formInteractive = getState().formInteractive;
      if (requestAction === FORM_USER_SUBMISSION) {
        dispatch(requestSubmitAnswer());
        dispatch(processSubmitAnswer(requestAction, formInteractive));
      }
      if (requestAction === FORM_AUTOSAVE && formInteractive.isModified) {
        dispatch(processSubmitAnswer(requestAction, formInteractive));
      }
  };
}

// ------------------------------------
// Action: requestSubmitAnswer
// ------------------------------------
export const requestSubmitAnswer = () => {
  return {
    type: REQUEST_SUBMIT
  }
}

// ------------------------------------
// Action: processSubmitAnswer
// ------------------------------------
export const processSubmitAnswer = (requestAction, formInteractive) => {

  const { id, answers, sessionId } = formInteractive;
  var answerRequest = {
    request_action: requestAction,
    answers: answers,
    form_id: id,
    session_id: sessionId
  };

  var requestURL = `${API_URL}/form_document/api/form_response/`;
  if (sessionId)
    requestURL += `${sessionId}/?form_id=${id}`;
  else
    requestURL += `?form_id=${id}`;

  const fetchParams = {
    method: 'POST',
    headers: {
      // Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(answerRequest)
  };

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const { form_id, response_id } = value;
      dispatch(updateSessionId(response_id));
      dispatch(doneSubmitAnswer({
        result,
        requestURL,
        requestAction
      })); // Hide submitting spinner
    }
  };
  
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(doneSubmitAnswer({
        result: false,
        requestURL,
        requestAction,
      })); // Hide submitting spinner
    }
  };

  return bind(fetch(requestURL, fetchParams), fetchSuccess, fetchFail);
}

// ------------------------------------
// Action: doneSubmitAnswer
// ------------------------------------
export const doneSubmitAnswer = (status) => {
  return {
    type: DONE_SUBMIT,
    status
  }
}

// ------------------------------------
// Action: updateFormSession
// ------------------------------------
export const updateSessionId = (sessionId) => {
  return {
    type: 'UPDATE_SESSION_ID',
    sessionId
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const formInteractiveReducer = (state = INIT_FORM_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id,
        title: action.title,
        slug: action.slug,
        form: action.form,
        lastUpdated: action.receivedAt,
        currentQuestionId: action.currentQuestionId,
        sessionId: action.sessionId
        // primaryColor: action.primaryColor
      });
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case DONE_FETCHING_FORM:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case GOTO_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: action.id,
      });
    case ANSWER_PREFILL:
      return Object.assign({}, state, {
        prefills: mergeItemIntoArray(state.prefills, action.prefill),
      });
    case STORE_ANSWER:
      return Object.assign({}, state, {
        answers: mergeItemIntoArray(state.answers, action.answer),
        isModified: true
      });
    case REQUEST_VERIFICATION:
      return Object.assign({}, state, {
        isVerifying: true,
      });
    case DONE_VERIFICATION:
      return Object.assign({}, state, {
        isVerifying: false,
      });
    case RECEIVE_VERIFICATION:
      return Object.assign({}, state, {
        verificationStatus: mergeItemIntoArray(state.verificationStatus, action.verification)
      });
    case UPDATE_SESSION_ID:
      return Object.assign({}, state, {
        sessionId: action.sessionId,
      });
    case REQUEST_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: true,
      });
    case DONE_SUBMIT:
      return Object.assign({}, state, {
        isSubmitting: false,
        isModified: action.result ? false : state.isModified,
        lastFormSubmitStatus: action.status,
      });
    default:
      return state;
  };
}

export default formInteractiveReducer;
