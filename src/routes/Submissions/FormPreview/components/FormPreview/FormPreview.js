import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import FormPreviewSection from '../FormPreviewSection/FormPreviewSection';
import { groupFormQuestions } from 'helpers/formInteractiveHelper';
import AccessCodeModal from 'components/Forms/AccessCodeModal/AccessCodeModal';
import styles from './FormPreview.scss';

class FormPreview extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
    primaryColor: React.PropTypes.string
  };

  static childContextTypes = {
    primaryColor: PropTypes.string
  };

  static propTypes = {
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,

    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object,

    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,

    /*
     * isFetchingForm: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetchingForm: PropTypes.bool.isRequired,

    /*
     * Form primary color
     */
    primaryColor: PropTypes.string,

    /*
     * fetchFormIfNeeded: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchFormIfNeeded: PropTypes.func.isRequired,

    /*
     * fetchAnswers: Redux action to receive answers with session id.
     */
    fetchAnswers: PropTypes.func.isRequired,

    /*
     * formAccessStatus: Redux state to check if it's accessible to form UI.
     */
    formAccessStatus: PropTypes.string.isRequired,

    /*
     * formAccessCode: Redux Code to access form UI.
     */
    formAccessCode: PropTypes.string.isRequired,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired,

    /*
     * params: Routing params
     */
    params: PropTypes.object,

    /*
     * sessionId: Session ID to fetch saved answer
     */
    sessionId: PropTypes.number,

    /*
     * updateAccessCode: Redux action to update the access code being typed.
     */
    updateAccessCode: PropTypes.func,

    /*
     * isAccessCodeProtected: Redux state to indicate the form is access code protected.
     */
    isAccessCodeProtected: PropTypes.bool
  };

  getChildContext() {
    return { primaryColor: this.props.primaryColor };
  };

  componentWillMount() {
    this.loadFormSession();
  }

  componentWillReceiveProps(props) {
    const { show } = this.props;
    if (this.props.formAccessStatus !== props.formAccessStatus &&
      props.formAccessStatus === 'fail') {
      show('accessCodeModal');
    }
  }

  loadFormSession = () => {
    const { fetchFormIfNeeded, fetchAnswers,
      params: { id, sessionId } } = this.props;
    fetchFormIfNeeded(id);
    if (sessionId) {
      fetchAnswers(sessionId);
    }
  }

  get renderFormSteps() {
    const props = this.props;
    const { form: { questions } } = props;
    const questionGroups = groupFormQuestions(questions);

    return (
      <div className={styles.stepsWrapper}>
        {
          questionGroups.map(function (group, index) {
            return (
              <FormPreviewSection key={index} questionGroup={group}
                step={index+1} totalSteps={questionGroups.length}
                {...props} />
            );
          })
        }
      </div>
    );
  }

  render() {
    const { form, formAccessStatus } = this.props;
    return (
      <div className={styles.formPreview}>
        <BuilderHeader />
        <div className={styles.formSteps}>
          {form && this.renderFormSteps}
          {formAccessStatus !== 'success' &&
            <AccessCodeModal onSuccess={this.loadFormSession}
              {...this.props} />
          }
        </div>
      </div>
    );
  }
}

export default FormPreview;
