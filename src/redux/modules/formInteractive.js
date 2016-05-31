import { bind } from 'redux-effects'
import { fetch } from 'redux-effects-fetch'
//import R from 'ramda'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM'
export const REQUEST_FORM = 'REQUEST_FORM'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const PREV_QUESTION = 'PREV_QUESTION'
export const STORE_ANSWER = 'STORE_ANSWER'

export const INIT_FORM_STATE = {
  id: 0,
  isFetching: false,
  isSubmitting: false,
  lastUpdated: Date.now(),
  form: {
    questions: [],
    logics:[]
  },
  currentQuestionId: 0,
  answers: [],
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

  const fetchSuccess = ({value: {form_data}}) => {
    return (dispatch, getState) => {
      dispatch(receiveForm(id, form_data))
      // dispatch(doneFetchingForm()); // Hide loading spinner
    }
  }
  
  const fetchFail = (data) => {
    console.log(data)
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
export const receiveForm = (id, form) => {
  return {
    type: RECEIVE_FORM,
    id: id,
    form: form,
    receivedAt: Date.now(),
    currentQuestionId: validateQuestionId(form)
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
// Action: storeAnswer
// ------------------------------------
export const storeAnswer = ({id, value}) => {
  return {
    type: STORE_ANSWER,
    answer: {
      id,
      value
    }
  }
}

const mergeAnswers = (answers, new_answer) => {
  return _.unionBy([new_answer], answers, 'id')  
}

// ------------------------------------
// Reducer
// ------------------------------------
const formInteractive = (state = INIT_FORM_STATE, action) => {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id,
        form: action.form,
        lastUpdated: action.receivedAt,
        isFetching: false,
        currentQuestionId: action.currentQuestionId,
        // primaryColor: action.primaryColor
      })
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case NEXT_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: getNextQuestion(state.form, state.currentQuestionId),
      })
    case PREV_QUESTION:
      return Object.assign({}, state, {
        currentQuestionId: getPrevQuestion(state.form, state.currentQuestionId),
      })
    case STORE_ANSWER:
      return Object.assign({}, state, {
        isSubmitting: true,
        answers: mergeAnswers(state.answers, action.answer),
        currentQuestionId: getNextQuestion(state.form, state.currentQuestionId),
      })
    default:
      return state;
  }
}

export default formInteractive