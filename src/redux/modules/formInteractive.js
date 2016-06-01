import { bind } from 'redux-effects'
import { fetch } from 'redux-effects-fetch'
import { findIndexById, mergeItemIntoArray } from 'helpers/pureFunctions'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM'
export const REQUEST_FORM = 'REQUEST_FORM'
export const DONE_FETCHING_FORM = 'DONE_FETCHING_FORM'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const PREV_QUESTION = 'PREV_QUESTION'
export const STORE_ANSWER = 'STORE_ANSWER'
export const GOTO_QUESTION = 'GOTO_QUESTION'
export const VERIFY_EMAIL = 'VERIFY_EMAIL'
export const REQUEST_VERIFY_EMAIL = 'REQUEST_VERIFY_EMAIL'
export const DONE_VERIFYING_EMAIL = 'DONE_VERIFYING_EMAIL'
export const RECEIVE_VERIFY_EMAIL = 'RECEIVE_VERIFY_EMAIL'

export const INIT_FORM_STATE = {
  id: 0,
  isFetching: false,
  isSubmitting: false,
  isVerifying: false,
  lastUpdated: Date.now(),
  form: {
    questions: [],
    logics:[]
  },
  title: 'Title',
  slug: 'slug',
  currentQuestionId: 0,
  answers: [],
  verificationStatus:[],
  primaryColor: '#DD4814'
}
// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// Action: fetchForm
// ------------------------------------
export const fetchForm = (id) => {

  const fetchParams = {
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json'
    },
    redirect: 'follow',
    method: 'GET'
  }

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(value))
      dispatch(doneFetchingForm()); // Hide loading spinner
    }
  }
  
  const fetchFail = (data) => {
    console.log(data)
    return (dispatch, getState) => {
      dispatch(doneFetchingForm()); // Hide loading spinner
    }
  }

  return bind(fetch(`${API_URL}/form_document/api/form/${id}`, fetchParams), fetchSuccess, fetchFail)
}

// ------------------------------------
// Action: requestForm
// ------------------------------------
export const requestForm = () => {
  return {
    type: REQUEST_FORM
  }
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
    currentQuestionId: validateQuestionId(data.form_data)
  }
}

// ------------------------------------
// Action: doneFetchingForm
// ------------------------------------
export const doneFetchingForm = () => {
  return {
    type: DONE_FETCHING_FORM
  }
}

const shouldFetchForm = (state, id) => {
  const formInteractive = state.formInteractive
  if (id !== formInteractive.id && !formInteractive.isFetching) {
    return true
  } else {
    return false
  }
}

// ------------------------------------
// Action: fetchFormIfNeeded
// ------------------------------------
export const fetchFormIfNeeded = (id) => {
  return (dispatch, getState) => {
    if (shouldFetchForm(getState(), id)) {
      dispatch(requestForm())
      dispatch(fetchForm(id))
    }
  }
}

const validateQuestionId = (form) => {
  const questions = form.questions
  for ( var i = 0; i < questions.length; i ++ ) {
    if (questions[i].type !== 'Group') return questions[i].id
  }
  return 1
}

// ------------------------------------
// Action: nextQuestion
// ------------------------------------
export const nextQuestion = () => {
  return {
    type: NEXT_QUESTION
  }
}

const getNextQuestion = (form, currentQuestionId) => {
  const questions = form.questions
  var curIdx, nextIdx
  curIdx = nextIdx = _.findIndex(questions, function(o) { return o.id == currentQuestionId; })
  while ( nextIdx < questions.length - 1 ) { 
    var q = questions[++nextIdx]
    if (q.type != 'Group') break;
  }
  if (questions[nextIdx].type == 'Group') nextIdx = curIdx
  return questions[nextIdx].id
}

// ------------------------------------
// Action: prevQuestion
// ------------------------------------
export const prevQuestion = () => {
  return {
    type: PREV_QUESTION
  }
}

const getPrevQuestion = (form, currentQuestionId) => {
  const questions = form.questions
  var curIdx, prevIdx
  curIdx = prevIdx = _.findIndex(questions, function(o) { return o.id == currentQuestionId; })
  while ( prevIdx > 1 ) { 
    var q = questions[--prevIdx]
    if (q.type != 'Group') break;
  }
  if (questions[prevIdx].type == 'Group') prevIdx = curIdx //In case it reaches index 0 and question type is 'Group'
  return questions[prevIdx].id
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
// Action: storeAnswer
// ------------------------------------
export const storeAnswer = ({id, value}) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(processStoreAnswer({id, value}))
    if ( shouldVerifyEmail(state, id) ) {
      dispatch(verifyEmail(id, value))
    }
  }
}

const shouldVerifyEmail = (state, id) => {
  const { formInteractive: { isVerifying, form: { questions } } } = state
  const idx = findIndexById(questions, id)

  if (_.indexOf(questions[idx].verifications, 'EmondoEmailFieldService') != -1)
    return true
  else
    return false
}

// ------------------------------------
// Action: verifyEmail
// ------------------------------------
export const processStoreAnswer = ({id, value}) => {
  return {
    type: STORE_ANSWER,
    answer: {
      id,
      value
    }
  }
}

// ------------------------------------
// Action: verifyEmail
// ------------------------------------
export const verifyEmail = (questionId, email) => {
  return (dispatch, getState) => {
    //if (!getState().isVerifying) {
      dispatch(requestVerifyEmail())
      dispatch(processVerifyEmail(questionId, email))
    //}
  }
}

// ------------------------------------
// Action: requestVerifyEmail
// ------------------------------------
export const requestVerifyEmail = () => {
  return {
    type: REQUEST_VERIFY_EMAIL
  }
}

// ------------------------------------
// Action: processVerifyEmail
// ------------------------------------
export const processVerifyEmail = (questionId, email) => {

  const fetchParams = {
    method: 'POST',
    body: JSON.stringify({
      email: email
    })
  }

  const fetchSuccess = ({value: {result}}) => {
    return (dispatch, getState) => {
      dispatch(receiveVerifyEmail(questionId, result))
      dispatch(doneVerifyingEmail()); // Hide loading spinner
    }
  }
  
  const fetchFail = (data) => {
    console.log(data)
  }

  return bind(fetch(`${API_URL}/verifications/api/email/verify/`, fetchParams), fetchSuccess, fetchFail)
  //return bind(fetch(`http://localhost/verify.php`, fetchParams), fetchSuccess, fetchFail)
}

// ------------------------------------
// Action: receiveVerifyEmail
// ------------------------------------
const receiveVerifyEmail = (questionId, status) => {
  return {
    type: RECEIVE_VERIFY_EMAIL,
    verification: {
      id: questionId,
      type: 'EmondoEmailFieldService',
      status
    }
  }
}

const doneVerifyingEmail = () => {
  return {
    type: DONE_VERIFYING_EMAIL
  }
}
// ------------------------------------
// Reducer
// ------------------------------------
const formInteractive = (state = INIT_FORM_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id,
        title: action.title,
        slug: action.slug,
        form: action.form,
        lastUpdated: action.receivedAt,
        currentQuestionId: action.currentQuestionId,
        // primaryColor: action.primaryColor
      })
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case DONE_FETCHING_FORM:
      return Object.assign({}, state, {
        isFetching: false,
      })
    case NEXT_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: getNextQuestion(state.form, state.currentQuestionId),
      })
    case PREV_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: getPrevQuestion(state.form, state.currentQuestionId),
      })
    case GOTO_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: action.id,
      })
    case STORE_ANSWER:
      return Object.assign({}, state, {
        // isSubmitting: true,
        answers: mergeItemIntoArray(state.answers, action.answer),
      })
    case REQUEST_VERIFY_EMAIL:
      return Object.assign({}, state, {
        isVerifying: true,
      })
    case DONE_VERIFYING_EMAIL:
      return Object.assign({}, state, {
        isVerifying: false,
      })
    case RECEIVE_VERIFY_EMAIL:
      return Object.assign({}, state, {
        verificationStatus: mergeItemIntoArray(state.verificationStatus, action.verification)
      })
    default:
      return state;
  }
}

export default formInteractive
