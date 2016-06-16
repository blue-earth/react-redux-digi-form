import { underscoreToCamelCase, findIndexById } from 'helpers/pureFunctions.js';
import _ from 'lodash';
import velocity from 'velocity-animate';

export const transformQuestions = (questions) => {
  var trQuestions = [];
  questions.forEach(q => {
    var new_q = {};

    for(var underscore_prop in q) {
      var camelProp = underscoreToCamelCase(underscore_prop);
      new_q[camelProp] = q[underscore_prop];
    }

    // Patching isEmail validation for EmailField
    if (new_q.type == 'EmailField') {
      new_q.validations = _.unionBy(new_q.validations, [{
        type: 'isEmail'
      }], 'type');
    }
    
    trQuestions.push(new_q);
  } )
  return trQuestions;
}

export const groupFormQuestions = (questions) => {
  const tempGroup = _.groupBy(transformQuestions(questions), function(q) {
    return (q.type === 'Group' ? 'groups' : typeof q.group !== 'undefined' ? q.group : 'orphans');
  });
  
  var newGroup = [];
  for (var prop in tempGroup.groups) {
    var group = tempGroup.groups[prop];
    newGroup.push({
      id: group.id,
      title: group.title,
      questions: tempGroup[group.id]
    });
  }
  return newGroup;
}

export const getContextFromAnswer = (answers) => {
  var context = {};
  answers.map(function(answer) {
    context['answer_' + answer.id] = answer.value;
  })
  return context;
}

export const getFirstQuestionOfGroup = (questionGroup) => {
  const questions = questionGroup.questions;
  if (typeof questions !== 'undefined') {
    return questions[0].id;
  } else {
    return 0;
  }
}

export function SlideAnimation(duration) {
  this.duration = typeof duration !== 'undefined' ? duration : 500;
  this.enter = (node, done) => {
    let ok = false;

    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    velocity(node, 'slideDown', {
      duration: this.duration,
      complete: complete,
    });
    return {
      stop: function() {
        velocity(node, 'finish');
        // velocity complete is async
        complete();
      }
    };
  }
  this.leave = (node, done) => {
    let ok = false;

    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    velocity(node, 'slideUp', {
      duration: this.duration,
      complete: complete,
    });
    return {
      stop: function() {
        velocity(node, 'finish');
        // velocity complete is async
        complete();
      },
    };
  }
}

export const shouldDisablePrevButton = (form, questionId) => {
  const { questions } = form;
  for ( var idx = 0; idx < questions.length - 1; idx ++ ) { 
    if (questions[idx].type != 'Group') break;
  }
  return questions[idx].id === questionId;
}

export const shouldDisableNextButton = (form, questionId) => {
  for (let logic of form.logics) {
    const itemFound = _.find(logic.conditions, { source_field: questionId });
    if (typeof itemFound !== 'undefined') return true;
  }
  return false;
}

export const getOutcomeWithQuestionId = (state, questionId) => {
  const { form: { logics }, answers } = state;
  for (let logic of logics) {
    const itemFound = _.find(logic.conditions, { source_field: questionId });

console.log('----item found-----');
console.log(itemFound);

    if (typeof itemFound === 'undefined') continue;

    var result = false;
    for (let condition of logic.conditions) {
      const answer = _.find(answers, {id: condition.source_field});
      // If the question not answered, no need to compare with this condition.
      if (typeof answer === 'undefined') {
        result = false;
        break;
      }
console.log('----answer value-----');
console.log(answer.value);
      // Performs logical OR, AND operation with condition.
      const conditionLogic = condition.condition_logic;
      const valueMeets = valueMeetsCondition(answer.value, condition);

console.log('----valueMeets-----');
console.log(valueMeets);

      if (typeof conditionLogic === 'undefined') {
        result = valueMeets;
      }
      if (conditionLogic === 'AND') {
        result = result && valueMeets;
      } else if (conditionLogic === 'OR') {
        result = result || valueMeets;
      }
    }
    if (result) return logic.outcome
  }
  return false;
}

const valueMeetsCondition = (value, condition) => {
  switch(condition.condition_name) {
    case 'equal_to':
      return value == condition.value;
    case 'not_equal_to':
      return value != condition.value;
    case 'begins_with':
      return typeof value === 'string' && value.startWith(condition.value);
    case 'ends_with':
      return typeof value === 'string' && value.endsWith(condition.value);
    case 'contains':
      return typeof value === 'string' && value.includes(condition.value);
    case 'does_not_contain':
      return typeof value === 'string' && !value.includes(condition.value);
    case 'less_than':
      return value < condition.value;
    case 'greater_than':
      return value > condition.value;
    case 'less_than_equal_to':
      return value <= condition.value;
    case 'greater_than_equal_to':
      return value >= condition.value;
    case 'is':
      return typeof value === 'object' ? _.isEqual(value, condition.value) : (value == condition.value);
    case 'not':
      return typeof value === 'object' ? !_.isEqual(value, condition.value) : (value != condition.value);
    // Date
    case 'on':
      return new Date(value).toDateString() == new Date(condition.value).toDateString();
    case 'not_on':
      return new Date(value).toDateString() != new Date(condition.value).toDateString();
    case 'before':
      return new Date(value) < new Date(condition.value);
    case 'after':
      return new Date(value) > new Date(condition.value);
    case 'before_on':
      const v1 = new Date(value);
      const v2 = new Date(condition.value);
      return v1.toDateString() == v2.toDateString() || v1 < v2;
    case 'after_on':
      const v3 = new Date(value);
      const v4 = new Date(condition.value);
      return v3.toDateString() == v4.toDateString() || v3 > v4;
    case 'one_of':
      return typeof condition.value === 'object' && condition.value.indexOf(value) != -1;
    default:
      return false;
  }
}
