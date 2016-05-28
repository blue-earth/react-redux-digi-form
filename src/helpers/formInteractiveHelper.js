import { underscoreToCamelCase } from 'helpers/pureFunctions.js'
import _ from 'lodash'

export const transformQuestions = (questions) => {
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

export const groupFormQuestions = (questions) => {
  const tempGroup = _.groupBy(transformQuestions(questions), function(q) {
    return (q.type === 'Group' ? 'groups' : typeof q.group !== 'undefined' ? q.group : 'orphans')
  })
  //const tempGroup = byGroup()
  
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

export const getQuestionIndexWithId = (questions, id) => {
  return _.findIndex(questions, function(o) { return o.id == id; })
}