import React, { Component, PropTypes } from 'react'
import FormSection from './FormSection'
import LearnMoreSection from './LearnMoreSection'
import styles from '../FormInteractive.scss'

class FormInteractiveView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div>
        		<h4>FormInteractive! page id {this.props.params.id}</h4>
        		<div className={styles.flowLine}></div>
				<FormSection active={true} step={1} totalStep={5} />
				<LearnMoreSection />
				<FormSection step={2} totalStep={5} />
			</div>
		)
    }
}

export default FormInteractiveView
