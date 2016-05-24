import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { MdCheck } from 'react-icons/lib/md'
import QuestionInteractive from 'components/Questions/QuestionInteractive/QuestionInteractive'
import styles from './FormSection.scss'

class FormSection extends Component {

  static propTypes = {
    status: React.PropTypes.oneOf(['pending', 'active', 'answered']),
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
        <div className="container">
          <Row>
            <Col xs={10} xsOffset={2}>
              <div className={styles.step}>
                { `${step} of ${totalSteps}` }
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>
                  {sectionTitle}
                  <Link to="#" className={styles.formSectionEdit}>Edit</Link>
                </h3>
                {this.renderAllQuestions}
              </div>
            </Col>
          </Row>
        </div>
      </section>
    )
  }

  get renderPendingSection() {
    const { step, totalSteps, sectionTitle } = this.props
    return (
      <section className={`${styles.formSection} ${styles.pending}`}>
        <div className="container">
          <Row>
            <Col xs={10} xsOffset={2}>
              <div className={styles.step}>
                { step }
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>{sectionTitle}</h3>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    )
  }

  get renderAnsweredSection() {
    const { step, totalSteps, sectionTitle } = this.props
    return (
      <section className={`${styles.formSection} ${styles.answered}`}>
        <div className="container">
          <Row>
            <Col xs={10} xsOffset={2}>
              <div className={styles.step}>
                <MdCheck className={styles.greenIcon} />
              </div>
              <div className={styles.formSectionInner}>
                <h3 className={styles.formSectionTitle}>{sectionTitle}</h3>
              </div>
            </Col>
          </Row>
        </div>
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
      return this.renderAnsweredSection
  }
}

export default FormSection
