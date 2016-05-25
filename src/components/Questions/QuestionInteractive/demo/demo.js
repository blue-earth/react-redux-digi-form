import QuestionInteractive from '../QuestionInteractive.js';
import React from 'react';
import ReactDOM from 'react-dom';

var AllQuestionTypes = React.createClass({
  render: function() {
    return (
      <div>
        {
          this.props.testingData.map(function(data, i) {
            return (
                <div key={i}>
                    <h2>{data.type}</h2>
                    <QuestionInteractive {...data}></QuestionInteractive>
                </div>
            )
          })
        }
      </div>
    );
  }
});

var firstNameData = {
    questionInstruction: 'What is your First Name?',
    questionDescription: 'The first name on your passport',
    type: 'ShortText',
    placeholderText: 'This is short text'
};

var mcQuestionData1 = {
    questionInstruction: 'What is the value of yoru savings and investments?',
    questionDescription: null,
    type: 'MultipleChoice',
    choices: [{
        label: 'A',
        text: '$1,000,000+'
    }, {
        label: 'B',
        text: '$200k - 900k'
    }],
    isRequired: true
};


var allQuestionsData = [
    firstNameData,
    mcQuestionData1
]

ReactDOM.render(<AllQuestionTypes testingData={allQuestionsData} />, document.getElementById('root'));