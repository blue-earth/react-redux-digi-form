import React, { Component, PropTypes } from 'react'
import FormHeader from 'components/FormHeader'
import FormSection from '../FormSection/FormSection'
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection'
import styles from './FormInteractive.scss'

class FormInteractive extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <FormHeader />
        <h4>FormInteractive! page id {this.props.params.id}</h4>
        <div className={styles.flowLine}></div>
        <FormSection active={true} step={1} totalStep={5} />
        <LearnMoreSection />
        <FormSection step={2} totalStep={5} />
      </div>
    )
  }
}

export default FormInteractive
