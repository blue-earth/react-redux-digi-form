import React, { Component, PropTypes } from 'react'
import FormHeader from 'components/FormHeader'
import FormSection from '../FormSection/FormSection'
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection'
import styles from './FormInteractive.scss'

var shortTextQuestionData = {
    questionInstruction: 'What is your First Name?',
    questionDescription: 'The first name on your passport',
    type: 'ShortText',
    isRequired: true
}

var mcQuestionData1 = {
    questionInstruction: 'What is the value of your savings and investments?',
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
}
var allQuestionsData = [
    shortTextQuestionData,
    mcQuestionData1
]

class FormInteractive extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <FormHeader />
        { /*<h4>FormInteractive! page id {this.props.params.id}</h4> */}
        <div className={styles.flowLine}></div>
        <FormSection status='answered' step={1} totalSteps={5} questions={allQuestionsData} />
        <FormSection status='active' step={2} totalSteps={5} questions={allQuestionsData} />
        <LearnMoreSection />
        <FormSection step={3} totalSteps={5} />
      </div>
    )
  }
}

export default FormInteractive
