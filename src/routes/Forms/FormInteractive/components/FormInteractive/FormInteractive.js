import React, { Component, PropTypes } from 'react'
import FormHeader from 'components/FormHeader'
import { Button } from 'react-bootstrap'
import FormSection from '../FormSection/FormSection'
import FormRow from '../FormRow/FormRow'
import LearnMoreSection from '../LearnMoreSection/LearnMoreSection'
import { fetchFormIfNeeded } from 'redux/modules/formInteractive'
import styles from './FormInteractive.scss'

class FormInteractive extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    questionGroups: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    let id = this.props.params.id
    dispatch(fetchFormIfNeeded(id))
  }

  get renderFormSteps() {
    const { questionGroups } = this.props
    
    const questionGroup = typeof questionGroups['0'] !== 'undefined' ? questionGroups[0] : {questions:[], title:''} //temperary;
    return (
      <div className={styles.stepsWrapper}>
        <FormSection status='completed' step={1} totalSteps={5} questionGroup={questionGroup} />
        <FormSection status='completed' step={1} totalSteps={5} questionGroup={questionGroup} />
        
        <hr className={styles.hrLine} />
        
        <FormSection status='active' step={2} totalSteps={5} questionGroup={questionGroup} />
        
        <hr className={styles.hrLine} />
        <FormRow>
          <LearnMoreSection />
        </FormRow>
        <FormRow>
          <h2 className={styles.nextSectionTitle}>Next Sections</h2>
        </FormRow>

        <FormSection step={3} totalSteps={5} />
        <FormSection step={4} totalSteps={5} />

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
