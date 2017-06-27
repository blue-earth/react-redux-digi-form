import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import FormHeader from 'components/Headers/FormHeader';
import ProgressTracker from '../ProgressTracker';
import SubmitButton from 'components/Buttons/FormEnterButton';
import FormCompletionSection from '../FormCompletionSection';
import FormRow from 'components/Forms/FormRow';
import StackLogo from 'components/Logos/StackLogo';
import {
  getNextQuestionId,
  getQuestionGroups,
  getQuestionGroupTitles
} from 'helpers/formInteractiveHelper';
import {
  FORM_AUTOSAVE,
  FORM_USER_SUBMISSION
} from 'redux/modules/formInteractive';
import { findIndexById } from 'helpers/pureFunctions';
import FormInteractiveView from '../FormInteractiveView';
import AccessCodeModal from 'components/Forms/AccessCodeModal';
import SaveForLaterModal from '../SaveForLaterModal';
import styles from './FormInteractive.scss';

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
     * goToPrevQuestion: Redux action to move to previous question.
     */
    goToPrevQuestion: PropTypes.func.isRequired,

    /*
     * goToNextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    goToNextQuestion: PropTypes.func.isRequired,

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
     * showModal: Redux modal show
     */
    showModal: PropTypes.func.isRequired,

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
    const { resetFormSubmitStatus, showModal } = this.props;
    if (props.lastFormSubmitStatus.requestAction === FORM_USER_SUBMISSION &&
      props.lastFormSubmitStatus.result) {
      if (props.shouldShowFinalSubmit) {
        this.context.router.push(`/forms/${this.props.id}/${this.props.sessionId}/completion`);
      } else {
        showModal('saveForLaterModal');
      }
      resetFormSubmitStatus();
    }
    if (this.props.formAccessStatus !== props.formAccessStatus &&
      props.formAccessStatus === 'fail') {
      showModal('accessCodeModal');
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

  setActiveGroup = (index) => {
    const { form: { questions }, goToQuestion } = this.props;
    const groups = getQuestionGroups(questions);
    const newGroupId = groups[index].id;
    // const question = _.find(questions, (o) => o.id === currentQuestionId);
    // if (question.group === newGroupId) return;
    const newQuestionId = getNextQuestionId(questions, newGroupId);
    goToQuestion(newQuestionId);
  }

  get currentSectionIndex() {
    const { form: { questions }, currentQuestionId } = this.props;
    if (!questions) return 0;
    const question = _.find(questions, (o) => o.id === currentQuestionId);
    const groups = getQuestionGroups(questions);
    const index = _.findIndex(groups, (o) => o.id === question.group);
    return index > 0 ? index : 0;
  }

  get isCompleted() {
    const { params: { status } } = this.props;
    return status === 'completion';
  }

  get needsAccessCode() {
    return this.props.formAccessStatus !== 'success';
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

  renderFormSteps() {
    const props = this.props;
    const { form: { questions }, shouldShowFinalSubmit } = props;
    const questionGroupTitles = getQuestionGroupTitles(questions);

    return (
      <div className={classNames(styles.contentWrapper, 'container')}>
        <div className={styles.contentWrapperInner}>
          <ProgressTracker
            sectionTitleList={questionGroupTitles}
            currentSectionIndex={this.currentSectionIndex}
            onItemChange={this.setActiveGroup}
          />
          <FormInteractiveView {...this.props} />
          <FormRow>
            {shouldShowFinalSubmit &&
              <div className={styles.submitButtonsArea}>
                <SubmitButton buttonLabel="SUBMIT APPLICATION" autoFocus onClick={this.handleFinalSubmit} />
              </div>
            }
          </FormRow>
          <div className={styles.bottomLogoWrapper}>
            <span>Powered by</span>
            <div className={styles.bottomLogo}>
              <StackLogo logoStyle="darkgrey" width={80} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFormCompletionSection() {
    const props = this.props;
    return (
      <div className={styles.stepsWrapper}>
        <FormCompletionSection
          {...props} />
        <FormRow />
      </div>
    );
  }

  render() {
    const { title, submitAnswer, form, id, sessionId } = this.props;
    return (
      <div className={styles.wrapper}>
        <FormHeader title={title} submitAnswer={submitAnswer} />
        {!this.isCompleted && !this.needsAccessCode && form &&
          this.renderFormSteps()
        }
        {!this.isCompleted &&
          <SaveForLaterModal formId={id} sessionId={sessionId} />
        }
        {this.isCompleted && this.renderFormCompletionSection()}
        {this.needsAccessCode &&
          <AccessCodeModal onSuccess={this.loadFormSession} {...this.props} />
        }
      </div>
    );
  }
}

export default FormInteractive;
