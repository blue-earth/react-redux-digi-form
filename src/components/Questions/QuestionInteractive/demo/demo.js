import QuestionInteractive from '../QuestionInteractive.js';
import React from 'react';
import ReactDOM from 'react-dom';




var AllQuestionTypes = React.createClass({
  render: function() {
    return (
      <div>
        {
          this.props.testingData.map(function(data) {
            return (
                <div>
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



var shortTextQuestionData = {
    questionInstruction: 'What is your First Name?',
    questionDescription: 'The first name on your passport',
    type: 'ShortText',
    isRequired: true
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
    shortTextQuestionData,
    mcQuestionData1
]


ReactDOM.render(<AllQuestionTypes testingData={allQuestionsData} />,
    document.getElementById('root'));
