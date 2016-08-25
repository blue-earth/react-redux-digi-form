import React, {
  Component,
  PropTypes
} from 'react';
import FormHeader from 'components/Headers/FormHeader';
import { Button } from 'react-bootstrap';
import FormSection from '../FormSection';
import SubmitButton from 'components/Buttons/FormEnterButton';
import FlowLine from 'components/Forms/FlowLine';
import FormCompletionSection from '../FormCompletionSection';
import FormRow from 'components/Forms/FormRow';
import {
  groupFormQuestions,
  SlideAnimation
} from 'helpers/formInteractiveHelper';
import {
  FORM_AUTOSAVE,
  FORM_USER_SUBMISSION
} from 'redux/modules/formInteractive';
import { findIndexById } from 'helpers/pureFunctions';
import SaveForLaterModal from '../SaveForLaterModal';
import AccessCodeModal from 'components/Forms/AccessCodeModal';
import styles from './FormInteractive.scss';
import Animate from 'rc-animate';

class FormInteractive extends Component {

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
     * title: Form title
     */
    title: PropTypes.string,

    /*
     * form: form_data of response, consists of questions and logics.
     */
    form: PropTypes.object,

    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,

    /*
     * prefills: Redux state that stores the array of answer prefills values
     */
    prefills: PropTypes.array.isRequired,

    /*
     * isFetchingForm: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetchingForm: PropTypes.bool.isRequired,

    /*
     * isVerifying: Redux state that indicates the status whether verification is in prgress with backend
     */
    isVerifying: PropTypes.bool.isRequired,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * Form primary color
     */
    primaryColor: PropTypes.string,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    verificationStatus: PropTypes.array,

    /*
     * prevQuestion: Redux action to move to previous question.
     */
    prevQuestion: PropTypes.func.isRequired,

    /*
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func.isRequired,

    /*
     * goToQuestion: Redux action to move to specific question by ID.
     */
    goToQuestion: PropTypes.func.isRequired,

    /*
     * fetchFormIfNeeded: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchFormIfNeeded: PropTypes.func.isRequired,

    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired,

    /*
     * submitAnswer: Redux action to send submit request to server. Here it will be submitted by user's action.
     */
    submitAnswer: PropTypes.func.isRequired,

    /*
     * fetchAnswers: Redux action to receive answers with session id.
     */
    fetchAnswers: PropTypes.func.isRequired,

    /*
     * resetFormSubmitStatus: Redux action to reset lastFormSubmitStatus.
     */
    resetFormSubmitStatus: PropTypes.func.isRequired,

    /*
     * resetFormSubmitStatus: Redux action to reset lastFormSubmitStatus.
     */
    lastFormSubmitStatus: PropTypes.object.isRequired,

    /*
     * shouldShowFinalSubmit: Redux state to check if it's final stage.
     */
    shouldShowFinalSubmit: PropTypes.bool.isRequired,

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

  componentDidMount() {
    const { submitAnswer } = this.props;
    setInterval(function () {
      submitAnswer(FORM_AUTOSAVE);
    }, 30000);  // todo: Will optimise this later
  }

  componentWillReceiveProps(props) {
    const { resetFormSubmitStatus, show } = this.props;
    if (props.lastFormSubmitStatus.requestAction === FORM_USER_SUBMISSION &&
      props.lastFormSubmitStatus.result) {
      if (props.shouldShowFinalSubmit) {
        this.context.router.push(`/forms/${this.props.id}/${this.props.sessionId}/completion`);
      } else {
        show('saveForLaterModal');
      }
      resetFormSubmitStatus();
    }
    if (this.props.formAccessStatus !== props.formAccessStatus &&
      props.formAccessStatus === 'fail') {
      show('accessCodeModal');
    }
  }

  sectionStatus(allQuestions, currentQuestionId, questionGroup) {
    const { shouldShowFinalSubmit } = this.props;
    const gq = questionGroup.questions;
    const curQueIdx = findIndexById(allQuestions, currentQuestionId);
    const firstGroupIdx = findIndexById(allQuestions, gq[0].id);
    const lastGroupIdx = findIndexById(allQuestions, gq[gq.length - 1].id);

    if (shouldShowFinalSubmit) return 'completed'; // check if it's the final step.

    if (curQueIdx < firstGroupIdx) return 'pending';
    else if (curQueIdx <= lastGroupIdx) return 'active';
    else return 'completed';
  }

  get renderFormSteps() {
    const props = this.props;
    const { form: { questions }, currentQuestionId, shouldShowFinalSubmit } = props;
    const that = this;
    const questionGroups = groupFormQuestions(questions);

    var slideAnimation = new SlideAnimation(1000);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave
    };

    return (
      <div className={styles.stepsWrapper}>
        <Animate exclusive animation={anim}>
          {
            questionGroups.map(function (group, index) {
              return (
                <FormSection key={index} questionGroup={group}
                  step={index+1} totalSteps={questionGroups.length}
                  status={that.sectionStatus(questions, currentQuestionId, group)}
                  {...props} />
              );
            })
          }
        </Animate>
        <FormRow>
          {shouldShowFinalSubmit &&
            <div className={styles.submitButtonsArea}>
              <SubmitButton buttonLabel="SUBMIT APPLICATION" autoFocus onClick={this.handleFinalSubmit} />
            </div>}
          <div className={styles.helpButtonWrapper}>
            <Button bsStyle="danger" block>Help</Button>
          </div>
        </FormRow>
      </div>
    );
  }

  get renderFormCompletionSection() {
    const props = this.props;
    return (
      <div className={styles.stepsWrapper}>
        <FormCompletionSection
          {...props} />
        <FormRow />
      </div>
    );
  }

  loadFormSession = () => {
    const { fetchFormIfNeeded, fetchAnswers,
      params: { id, sessionId } } = this.props;
    fetchFormIfNeeded(id);
    if (sessionId) {
      fetchAnswers(sessionId);
    }
  }

  handleFinalSubmit = () => {
    const { submitAnswer } = this.props;
    submitAnswer(FORM_USER_SUBMISSION);
  }

  render() {
    const { title, submitAnswer, params: { status }, formAccessStatus,
      form, id, sessionId } = this.props;
    return (
      <div>
        <FormHeader title={title} submitAnswer={submitAnswer} />
        <FlowLine />
        {status !== 'completion' && form && this.renderFormSteps}
        {status !== 'completion' &&
          <SaveForLaterModal formId={id} sessionId={sessionId} />
        }
        {status === 'completion' && this.renderFormCompletionSection}
        {formAccessStatus !== 'success' &&
          <AccessCodeModal onSuccess={this.loadFormSession}
            {...this.props} />
        }
      </div>
    );
  }
}

export default FormInteractive;
