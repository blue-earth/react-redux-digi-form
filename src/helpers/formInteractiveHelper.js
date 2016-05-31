import { underscoreToCamelCase } from 'helpers/pureFunctions.js'
import _ from 'lodash'

export const transformQuestions = (questions) => {
  var trQuestions = []
  questions.forEach(q => {
    var new_q = {}

    for(var underscore_prop in q) {
      var camelProp = underscoreToCamelCase(underscore_prop)
      new_q[camelProp] = q[underscore_prop];
    }

    // Patching isEmail validation for email field
    if (new_q.type == 'EmailField') {
      new_q.validations = _.unionBy(new_q.validations, [{
        type: 'isEmail'
      }], 'type')
    }
    
    trQuestions.push(new_q)
  } )
  return trQuestions
}

export const groupFormQuestions = (questions) => {
  const tempGroup = _.groupBy(transformQuestions(questions), function(q) {
    return (q.type === 'Group' ? 'groups' : typeof q.group !== 'undefined' ? q.group : 'orphans')
  })
  
  var newGroup = []
  for (var prop in tempGroup.groups) {
    var group = tempGroup.groups[prop]
    newGroup.push({
      id: group.id,
      title: group.title,
      questions: tempGroup[group.id]
    })
  }
  return newGroup
}

export const getContextFromAnswer = (answers) => {
  var context = {}
  answers.map(function(answer) {
    context['answer_' + answer.id] = answer.value
  })
  return context
}

export const findIndexById = (obj_array, id) => {
  return _.findIndex(obj_array, function(o) { return o.id == id })
}