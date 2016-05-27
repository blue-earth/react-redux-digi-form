import { bind } from 'redux-effects'
import { fetch } from 'redux-effects-fetch'
//import R from 'ramda'
import _ from 'lodash'

// import fetch from 'isomorphic-fetch'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM'
export const REQUEST_FORM = 'REQUEST_FORM'
export const NEXT_QUESTION = 'NEXT_QUESTION'
export const PREV_QUESTION = 'PREV_QUESTION'

export const INIT_FORM_STATE = {
  id: 0,
  isFetching: false,
  lastUpdated: Date.now(),
  form: {
    questions: [],
    logics:[]
  },
  currentQuestionId: 0,
  answers: []
}
// ------------------------------------
// Actions
// ------------------------------------
export function fetchForm(id) {

  const fetchParams = {
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json'
    },
    redirect: 'follow',
    method: 'GET'
  }

  const fetchSuccess = ({value}) => {
    return dispatch => {
      dispatch(receiveForm(id, value))
      // dispatch(doneFetchingForm()); // Hide loading spinner
    }
  }
  
  const fetchFail = (data) => {
    console.log(data)
  }

  return bind(fetch(`${API_URL}/form.php`, fetchParams), fetchSuccess, fetchFail)

  // return dispatch => {
  //   // dispatch(setFetchingFormState()); // Show a loading spinner  
  //   return fetch(`${API_URL}/form.php`, {
  //       headers: {
  //         'Accept': 'application/json',
  //       },
  //       redirect: 'follow',
  //       method: 'GET'
  //     })
  //     .then(response => response.json())
  //     .then(json => {
  //       dispatch(receiveForm(id, json))
  //       // dispatch(setFetchingFormState()); // Show a loading spinner
  //     })
  // }

}

export function receiveForm(id, form) {
  return {
    type: RECEIVE_FORM,
    id: id,
    form: form,
    receivedAt: Date.now(),
    currentQuestionId: initcurrentQuestionId(form)
  }
}

function shouldFetchForm(state, id) {
  const formInteractive = state.formInteractive
  if (id !== formInteractive.id && !formInteractive.isFetching) {
    return true
  } else {
    return false
  }
}

export function fetchFormIfNeeded(id) {
  return (dispatch, getState) => {
    if (shouldFetchForm(getState(), id)) {
      return dispatch(fetchForm(id))
    }
  }
}

const initcurrentQuestionId = (form) => {
  const questions = form.questions
  for ( var i = 0; i < questions.length; i ++ ) {
    if (questions[i].type !== 'Group') return questions[i].id
  }
  return 1
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

export function nextQuestion() {
  return {
    type: NEXT_QUESTION
  }
}

export function prevQuestion() {
  return {
    type: PREV_QUESTION
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function formInteractive(state = INIT_FORM_STATE, action) {
  switch (action.type) {
    case RECEIVE_FORM:
      return Object.assign({}, state, {
        id: action.id,
        form: action.form,
        lastUpdated: action.receivedAt,
        isFetching: false,
        currentQuestionId: action.currentQuestionId
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
    // case ANSWER_QUESTION:
    //   return
    default:
      return state;
  }
}