import QuestionInteractive from '../QuestionInteractive.js';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

var AllQuestionTypes = React.createClass({
  propTypes: {
    testingData: PropTypes.array
  },

  render: function () {
    return (
      <div>
        {
          this.props.testingData.map(function (data, i) {
            return (
              <div key={i}>
                <h2>{data.type}</h2>
                <QuestionInteractive {...data} />
              </div>
            );
          })
        }
      </div>
    );
  }
});

var firstNameData = {
  questionInstruction: 'What is your First Name?',
  questionDescription: 'The first name on your passport',
  type: 'ShortTextField',
  placeholderText: 'Please enter First Name'
};

var companyABNData = {
  questionInstruction: 'What is the companies ABN?',
  questionDescription: 'Don\'t know, <a href="#">search on the ABR</a> or check your Trust Deed',
  type: 'ShortTextField',
  placeholderText: 'Please enter companies ABN'
};

var emailData = {
  questionInstruction: 'What is your email address?',
  questionDescription: '',
  type: 'EmailField',
  placeholderText: ''
};

var longTextData = {
  questionInstruction: 'Overview',
  questionDescription: 'This is the overview',
  type: 'LongTextField',
  placeholderText: ''
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

var signatureData = {
  type: 'SignatureField',
  questionInstruction: 'Signature Field',
  questionDescription: 'SignatureField description'
};

var allQuestionsData = [
  signatureData,
  firstNameData,
  companyABNData,
  emailData,
  longTextData,
  mcQuestionData1
];

ReactDOM.render(<AllQuestionTypes testingData={allQuestionsData} />, document.getElementById('root'));
