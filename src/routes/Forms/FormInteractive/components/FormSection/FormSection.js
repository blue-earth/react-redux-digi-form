import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { MdCheck, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md'
import QuestionInteractive from 'components/Questions/QuestionInteractive/QuestionInteractive'
import FormRow from '../FormRow/FormRow'
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection'
import { getQuestionIndexWithId } from 'helpers/formInteractiveHelper'
import styles from './FormSection.scss'
import _ from 'lodash'

class FormSection extends Component {

  static propTypes = {
    status: React.PropTypes.oneOf(['pending', 'active', 'completed']),
    step: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    totalSteps: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    allQuestions: PropTypes.array.isRequired,
    questionGroup: PropTypes.object.isRequired,
    logics: PropTypes.array,
    currentQuestionId: PropTypes.number.isRequired,
    prevQuestion: PropTypes.func.isRequired,
    nextQuestion: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    status: 'pending',
    step: 1,
    totalSteps: 1,
    questionGroup: {
      title: 'Basic Details',
      questions: []
    }
  }

  get renderAllQuestions() {
    const { questionGroup: {questions}, currentQuestionId, allQuestions } = this.props
    const curQIdx = getQuestionIndexWithId(allQuestions, currentQuestionId)
    if (questions) {
      return (
        <div>
          {
            questions.map(function(question, i) {
              const idx = getQuestionIndexWithId(allQuestions, question.id)
              console.log(idx)
              return (
                <div key={question.id}>
                    <QuestionInteractive {...question} 
                      status={curQIdx == idx 
                        ? 'current' : curQIdx - idx == 1 
                        ? 'next' : idx - curQIdx == 1
                        ? 'prev' : 'hidden'} 
                    />
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return ''
    }
  }

  shouldShowActiveTitle() {
    const { allQuestions, currentQuestionId, questionGroup } = this.props
    const groupQuestions = questionGroup.questions
    const curQIdx = getQuestionIndexWithId(allQuestions, currentQuestionId)
    const firstGroupIdx = getQuestionIndexWithId(allQuestions, groupQuestions[0].id)
    return (curQIdx == firstGroupIdx)
  }

  get renderActiveSection() {
    const { step, totalSteps, questionGroup, prevQuestion, nextQuestion } = this.props

    
    return (
      <section className={`${styles.formSection} ${styles.active}`}>
        <hr className={styles.hrLine} />
        <FormRow>
          <div className={styles.step}>
            { `${step} of ${totalSteps}` }
          </div>
          <div className={styles.formSectionInner}>
            { this.shouldShowActiveTitle() && (
            <h3 className={styles.formSectionTitle}>
              {questionGroup.title}
            </h3>
            )}
            {this.renderAllQuestions}
          </div>
          <ul className={styles.navButtonsWrapper}>
            <li>
              <Button className={styles.navButton} onClick={() => prevQuestion()}>
                <MdKeyboardArrowUp size="24" />
              </Button>
            </li>
            <li>
              <Button className={styles.navButton} onClick={() => nextQuestion()}>
                <MdKeyboardArrowDown size="24" />
              </Button>
            </li>
          </ul>
        </FormRow>
        <hr className={styles.hrLine} />
        <FormRow>
          <LearnMoreSection />
        </FormRow>
        { step < totalSteps &&
          <FormRow>
            <h2 className={styles.nextSectionTitle}>Next Sections</h2>
          </FormRow>
        }
      </section>
    )
  }

  get renderPendingSection() {
    const { step, totalSteps, questionGroup } = this.props
    return (
      <section className={`${styles.formSection} ${styles.pending}`}>
        <FormRow>
          <div className={styles.step}>
            { step }
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>{questionGroup.title}</h3>
          </div>
        </FormRow>
      </section>
    )
  }

  get renderCompletedSection() {
    const { step, totalSteps, questionGroup } = this.props
    return (
      <section className={`${styles.formSection} ${styles.completed}`}>
        <FormRow>
          <div className={styles.step}>
            <a href="javascript:;"><MdCheck className={styles.greenIcon} /></a>
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>
              {questionGroup.title}
              <a href="javascript:;" className={styles.formSectionEdit}>Edit</a>
            </h3>
          </div>
        </FormRow>
      </section>
    )
  }

  render() {
    const { status } = this.props
    if ( status === 'active' )
      return this.renderActiveSection
    else if ( status === 'pending' )
      return this.renderPendingSection
    else
      return this.renderCompletedSection
  }
}

export default FormSection
