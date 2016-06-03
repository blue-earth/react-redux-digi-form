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

    // Patching isEmail validation for email field
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

export const shouldDisablePrevButton = (form, currentQuestionId) => {
  const questions = form.questions;
  for ( var idx = 0; idx < questions.length - 1; idx ++ ) { 
    if (questions[idx].type != 'Group') break;
  }
  return questions[idx].id === currentQuestionId;
}

export const shouldDisableNextButton = (form, currentQuestionId) => {
  for (let logic of form.questions) {
    const itemFound = _.find(logic.conditions, { source_field: currentQuestionId });
    if (typeof itemFound !== 'undefined') return true;
  }
  return false;
}
