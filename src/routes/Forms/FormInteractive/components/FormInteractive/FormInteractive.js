import React, { Component, PropTypes } from 'react'
import FormHeader from 'components/FormHeader'
import { Button } from 'react-bootstrap'
import FormSection from '../FormSection/FormSection'
import FormRow from '../FormRow/FormRow'
import { fetchFormIfNeeded } from 'redux/modules/formInteractive'
import { groupFormQuestions, getQuestionIndexWithId } from 'helpers/formInteractiveHelper.js'
import styles from './FormInteractive.scss'

class FormInteractive extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    currentQuestionId: PropTypes.number.isRequired,
    primaryColor: PropTypes.string,
    prevQuestion: PropTypes.func.isRequired,
    nextQuestion: PropTypes.func.isRequired,
    fetchFormIfNeeded: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchFormIfNeeded } = this.props
    let id = this.props.params.id
    fetchFormIfNeeded(id)
  }

  sectionStatus(allQuestions, currentQuestionId, questionGroup) {
    const gq = questionGroup.questions
    const curQueIdx = getQuestionIndexWithId(allQuestions, currentQuestionId)
    const firstGroupIdx = getQuestionIndexWithId(allQuestions, gq[0].id)
    const lastGroupIdx = getQuestionIndexWithId(allQuestions, gq[gq.length - 1].id)

    if (curQueIdx < firstGroupIdx) return 'pending'
    else if (curQueIdx <= lastGroupIdx) return 'active'
    else return 'completed'
  }

  get renderFormSteps() {
    const { prevQuestion, nextQuestion, form: { questions }, 
      currentQuestionId, primaryColor } = this.props
    const sectionStatus = this.sectionStatus
    const questionGroups = groupFormQuestions(questions)
    return (
      <div className={styles.stepsWrapper}>
        {
          questionGroups.map(function(group, index) {
            return (
              <FormSection key={index} currentQuestionId={currentQuestionId}
                allQuestions={questions} questionGroup={group}
                step={index+1} totalSteps={questionGroups.length} 
                nextQuestion={nextQuestion} prevQuestion={prevQuestion}
                status={sectionStatus(questions, currentQuestionId, group)} 
                primaryColor={primaryColor} />
            )
          })
        }
        <FormRow>
          <div className={styles.helpButtonWrapper}>
            <Button bsStyle="danger" block>Help</Button>
          </div>
        </FormRow>
      </div>
    )
  }

  render() {
    return (
      <div>
        <FormHeader />
        <div className={styles.flowLine}></div>
        { this.renderFormSteps }
      </div>
    )
  }
}

export default FormInteractive
