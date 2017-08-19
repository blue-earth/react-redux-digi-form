import QuestionInstruction from '../QuestionInstruction.js';
import React from 'react';
import ReactDOM from 'react-dom';

var questionData = {
  instruction: '{{name}}, are you a Company Director of Digital Online Solutions?',
  description: 'Please enter the <a href="http://www.google.com">name</a> of the director.',
  isRequired: true,
  isFocused: true,
  context: {
    name: 'Jordan'
  }
};

const test1 = (
    <QuestionInstruction {...questionData}>
    </QuestionInstruction>
);

ReactDOM.render(test1, document.getElementById('app'));
