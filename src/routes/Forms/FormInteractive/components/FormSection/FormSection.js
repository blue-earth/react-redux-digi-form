import React, { Component, PropTypes } from 'react'
import styles from './FormSection.scss'
import { Col, Row } from 'react-bootstrap'

class FormSection extends Component {
  static propTypes = {
    active: PropTypes.bool,
    step: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    totalSteps: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    form: React.PropTypes.shape({
      questions: PropTypes.array,
      logics: PropTypes.array
    })
  }

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    active: false,
    step: 1,
    totalSteps: 1
  }

  render() {
    const { active, step, totalSteps } = this.props
    return (
      <section className={`${styles.formSection} ${active ? styles.active : ''}`}>
        <div className="container">
          <Row>
            <Col xs={10} xsOffset={2}>
              <div className={styles.step}>
                { active ? `${step} of ${totalSteps}` : step}
              </div>
              <div className={styles.formSectionInner}>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    )
  }
}

export default FormSection
