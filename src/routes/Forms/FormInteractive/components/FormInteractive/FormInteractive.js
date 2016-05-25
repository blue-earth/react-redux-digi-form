import React, { Component, PropTypes } from 'react'
import FormHeader from 'components/FormHeader'
import FormSection from '../FormSection/FormSection'
import FormRow from '../FormRow/FormRow'
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

  get renderFormSteps() {
    return (
      <div className={styles.stepsWrapper}>
        <FormSection status='completed' step={1} totalSteps={5} questions={allQuestionsData} />
        <FormSection status='completed' step={1} totalSteps={5} questions={allQuestionsData} />
        
        <hr className={styles.hrLine} />
        
        <FormSection status='active' step={2} totalSteps={5} questions={allQuestionsData} />
        
        <hr className={styles.hrLine} />
        <FormRow>
          <LearnMoreSection />
          <h2 className={styles.nextSectionTitle}>Next Sections</h2>
        </FormRow>

        <FormSection step={3} totalSteps={5} />
        <FormSection step={4} totalSteps={5} />
      </div>
    )
  }
  render() {
    return (
      <div>
        <FormHeader />
        <div className={styles.flowLine}></div>
        { this.renderFormSteps }
        { /* <h4>FormInteractive! page id {this.props.params.id}</h4> */ }
      </div>
    )
  }
}

export default FormInteractive
