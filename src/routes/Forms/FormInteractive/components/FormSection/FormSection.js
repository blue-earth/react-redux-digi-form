import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { MdCheck, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/lib/md'
import QuestionInteractive from 'components/Questions/QuestionInteractive/QuestionInteractive'
import FormRow from '../FormRow/FormRow'
import styles from './FormSection.scss'

class FormSection extends Component {

  static propTypes = {
    status: React.PropTypes.oneOf(['pending', 'active', 'completed']),
    sectionTitle: React.PropTypes.string,
    step: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    totalSteps: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    questions: PropTypes.array,
    logics: PropTypes.array
  }

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    status: 'pending',
    step: 1,
    totalSteps: 1,
    sectionTitle: 'Basic Details'
  }
  
  get renderAllQuestions() {
    const questions = this.props.questions
    if (questions) {
      return (
        <div>
          {
            questions.map(function(data, i) {
              return (
                  <div key={i}>
                      <h2>{data.type}</h2>
                      <QuestionInteractive {...data}></QuestionInteractive>
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

  get renderActiveSection() {
    const { step, totalSteps, sectionTitle } = this.props
    return (
      <section className={`${styles.formSection} ${styles.active}`}>
        <FormRow>
          <div className={styles.step}>
            { `${step} of ${totalSteps}` }
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>
              {sectionTitle}
            </h3>
            {this.renderAllQuestions}
          </div>
          <ul className={styles.navButtonsWrapper}>
            <li><Link className={styles.navButton} to="#"><MdKeyboardArrowUp size="24" /></Link></li>
            <li><Link className={styles.navButton} to="#"><MdKeyboardArrowDown size="24" /></Link></li>
          </ul>
        </FormRow>
      </section>
    )
  }

  get renderPendingSection() {
    const { step, totalSteps, sectionTitle } = this.props
    return (
      <section className={`${styles.formSection} ${styles.pending}`}>
        <FormRow>
          <div className={styles.step}>
            { step }
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>{sectionTitle}</h3>
          </div>
        </FormRow>
      </section>
    )
  }

  get renderCompletedSection() {
    const { step, totalSteps, sectionTitle } = this.props
    return (
      <section className={`${styles.formSection} ${styles.completed}`}>
        <FormRow>
          <div className={styles.step}>
            <Link to="#"><MdCheck className={styles.greenIcon} /></Link>
          </div>
          <div className={styles.formSectionInner}>
            <h3 className={styles.formSectionTitle}>
              {sectionTitle}
              <Link to="#" className={styles.formSectionEdit}>Edit</Link>
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
