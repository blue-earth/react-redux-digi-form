import { bind } from 'redux-effects'
import { fetch } from 'redux-effects-fetch'
import R from 'ramda'
import { underscoreToCamelCase } from 'helpers/pureFunctions.js'

// import fetch from 'isomorphic-fetch'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_FORM = 'RECEIVE_FORM'
export const REQUEST_FORM = 'REQUEST_FORM'

export const INIT_FORM_STATE = {
  id: 0,
  isFetching: false,
  lastUpdated: Date.now(),
  form: {
    questions: [],
    logics:[]
  },
  answers: [],
  questionGroups: {}
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
    questionGroups: groupFormQuestions(form.questions),
    receivedAt: Date.now()
  }
}

const transformQuestions = (questions) => {
  var trQuestions = []
  questions.forEach(q => {
    var new_q = {}
    /*
    var new_q = {
      id: q.id,
      type: q.type
    }
    q.title && (new_q.title = q.title)
    q.question_instruction && (new_q.questionInstruction = q.question_instruction)
    q.question_description && (new_q.questionDescription = q.question_description)
    q.placeholder_text && (new_q.placeholderText = q.placeholder_text)
    q.attachment && (new_q.attachment = q.attachment)
    q.verifications && (new_q.verifications = q.verifications)

    q.error_text && (new_q.errorText = q.error_text)
    q.initial_value && (new_q.initialValue = q.initial_value)
    q.full_width && (new_q.fullWidth = q.full_width)
    q.allow_multiple && (new_q.allowMultiple = q.allow_multiple)
    q.choices && (new_q.choices = q.choices)
    typeof q.group !== 'undefined' && (new_q.group = q.group)
    
    */
    
    for(var underscore_prop in q) {
      if (underscore_prop === 'validations') continue
      var camelProp = underscoreToCamelCase(underscore_prop)
      new_q[camelProp] = q[underscore_prop];
    }

    if (q.validations) {
      q.validations.forEach( v => {
        new_q[v.type] = (v.type == 'isRequired') ? true : v.value
      } )
    }
    
    trQuestions.push(new_q)
  } )
  return trQuestions
}

const groupFormQuestions = (questions) => {
  const byGroup = R.groupBy(function(q) {
    return (q.type === 'Group' ? 'groups' : typeof q.group !== 'undefined' ? q.group : 'orphans')
  })
  const tempGroup = byGroup(transformQuestions(questions))
  
  var newGroup = {}
  for (var prop in tempGroup.groups) {
    var group = tempGroup.groups[prop]
    newGroup[group.id] = {
      id: group.id,
      title: group.title,
      questions: tempGroup[group.id]
    }
  }
  return newGroup
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
        questionGroups: action.questionGroups
      })
    case REQUEST_FORM:
      return Object.assign({}, state, {
        isFetching: true,
      })
    default:
      return state;
  }
}