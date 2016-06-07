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
}

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

var statementData = {
    "id": 24,
    "type": "StatementField",
    "instruction": "1. The information I have provided to CMC Markets Singapore Pte. Ltd. (\"CMC Markets\") about myself and in connection with this application is accurate and not misleading in any material respect. In addition, I will notify CMC Markets immediately if any of that information materially changes or ceases to be true or correct.<br /><br />2. I understand and accept that, if CMC Markets approves this application, CMC Markets will provide its services/products to me in accordance with the Terms of Business and that for my own benefit and protection I should read that document and the documents referred to within it, including in particular the Risk Warning Notice for CFD.<br /><br />3. I understand that transactions in contracts for differences (CFDs) are leveraged products and that it is possible to lose more than my deposit.*<br /><br />4. I understand and accept that my orders will be executed in accordance with CMC Markets' Order Execution Policy Summary for CFDs.<br /><br />5. I understand and accept that all information regarding my account with CMC Markets, including all information about my transaction activity, will be provided to me through the online platform and via email and not on paper.",
    "group": 21
};

var allQuestionsData = [
    firstNameData,
    companyABNData,
    emailData,
    longTextData,
    mcQuestionData1,
    statementData
]

ReactDOM.render(<AllQuestionTypes testingData={allQuestionsData} />, document.getElementById('root'));