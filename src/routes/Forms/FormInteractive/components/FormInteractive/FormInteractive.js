import React, { Component, PropTypes } from 'react';
import Validator from 'components/Validator/Validator';
import Verifier from 'components/Verifier/Verifier';
import validateField from 'helpers/validationHelper';
import FormHeader from 'components/Headers/FormHeader';
import SubmitButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import { Button, Modal } from 'react-bootstrap';
import FormSection from '../FormSection/FormSection';
import FormCompletionSection from '../FormCompletionSection/FormCompletionSection';
import FormRow from '../FormRow/FormRow';
import { groupFormQuestions, SlideAnimation, getSessionURL }
  from 'helpers/formInteractiveHelper.js';
import { FORM_AUTOSAVE, FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormInteractive.scss';
import Animate from 'rc-animate';

class FormInteractive extends Component {

  constructor(props) {
    super(props);
    // todo: Add comments to below three states
    // When they are true/false, what are possible values?
    this.state = {
      showTempModal: false,   // todo: Change to a more descriptive name
      showAccessModal: true,  // good example of a descriptive name
      accessCodeInputStatus: 'changing'   // prefer to use a boolean here, and name the variable to
                                          // isEnteringStatusCode, is this property needed
    };
  };

  static contextTypes = {
    router: React.PropTypes.object,
    primaryColor: React.PropTypes.string
  };

  static childContextTypes = {
    primaryColor: PropTypes.string
  };

  getChildContext() {
    return { primaryColor: this.props.primaryColor };
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
     * shouldShowFinalSubmit: Redux statue to check if it's final stage.
     */
    shouldShowFinalSubmit: PropTypes.bool.isRequired,

    /*
     * formAccessStatus: Redux statue to check if it's accessible to form UI.
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

    params: PropTypes.object,

    sessionId: PropTypes.number,

    updateAccessCode: PropTypes.func
  };

  componentWillMount() {
    const { fetchFormIfNeeded, fetchAnswers,
      params: { id, sessionId } } = this.props;
    fetchFormIfNeeded(id);
    if (sessionId) {
      fetchAnswers(sessionId);
    }
  }

  componentWillReceiveProps(props) {
    const { resetFormSubmitStatus } = this.props;
    // todo: Comment on ``lastFormSubmitStatus``, what are an example of this object
    // how each property is used etc..
    // comment can be made on formInteractive.js file
    if (props.lastFormSubmitStatus.requestAction === FORM_USER_SUBMISSION &&
    props.lastFormSubmitStatus.result) {
      if (props.shouldShowFinalSubmit) {
        this.context.router.push(`/forms/${this.props.id}/${this.props.sessionId}/completion`);
      } else {
        this.setState({ showTempModal: true });
      }
      resetFormSubmitStatus();
    }
  }

  // todo: Can you restructure the code a bit?
  // See https://github.com/airbnb/javascript/tree/master/react#ordering
  componentDidMount() {
    const { submitAnswer } = this.props;
    setInterval(function () {
      submitAnswer(FORM_AUTOSAVE);
    }, 30000);  // todo: Will optimise this later
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
    const { form: { questions }, currentQuestionId, shouldShowFinalSubmit } = this.props;
    const props = this.props;
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

  handleHideTempModal = () => {
    this.setState({'showTempModal': false});
  }

  handleAccessCodeInput = (value) => {
    const { updateAccessCode } = this.props;
    updateAccessCode(value);
    this.setState({
      accessCodeInputStatus: 'changing'
    });
  }

  handleFormAccess = () => {
    const { id, fetchFormIfNeeded, formAccessCode, sessionId, fetchAnswers } = this.props;
    var isAccessCodeValid = validateField({type: 'minLength', value: 4}, formAccessCode) &&
    validateField({type: 'maxLength', value: 4}, formAccessCode);
    if (isAccessCodeValid) {
      this.setState({
        accessCodeInputStatus: 'validated'
      });
      fetchFormIfNeeded(id);
      if (sessionId) {
        fetchAnswers(sessionId);
      }
    } else {
      if (!validateField({type: 'minLength', value: 4}, formAccessCode)) {
        this.setState({ accessCodeInputStatus: 'minLengthUnvalidated' });
      } else {
        this.setState({ accessCodeInputStatus: 'maxLengthUnvalidated' });
      }
    }
  }

  handleFinalSubmit = () => {
    const { submitAnswer } = this.props;
    submitAnswer(FORM_USER_SUBMISSION);
  }

  // Temp Modal for submit response.
  renderTempResponseModal() {
    const { sessionId, id } = this.props;
    const { showTempModal } = this.state;

    return (
      <Modal show={showTempModal} bsSize="large"
        onHide={this.handleHideTempModal}>
        <Modal.Header closeButton>
          <Modal.Title>Form Saved.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here's the URL to restore your session.</p>
          <div className="form-control">{getSessionURL(id, sessionId)}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHideTempModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Access Modal for Access form UI.
  renderAccessResponseModal(formAccessStatus) {
    const { showAccessModal, accessCodeInputStatus } = this.state;
    const { formAccessCode } = this.props;
    const showVerificationStatus = accessCodeInputStatus === 'validated' &&
      showAccessModal === true;

    var optionals = {};
    if (this.context.primaryColor) {
      optionals['style'] = {
        color: this.context.primaryColor
      };
    }
    const accessCodeErrorText = 'Access Code must be 4 digits.';
    return (
      <Modal show={showAccessModal} dialogClassName={styles.modalWrapper}>
        <div className={styles.accessModalWrapper}>
          Enter the 4 digit access code <br />to continue
          <div className={styles.modalDigitInput}>
            <ShortTextInput type="NumberField" value={formAccessCode}
              onChange={this.handleAccessCodeInput}
              autoFocus onEnterKey={this.handleFormAccess} />
          </div>
          <div className={styles.modalSubmitButton}>
            <SubmitButton onClick={this.handleFormAccess} />
          </div>
          <div className={styles.modalValidator}>
            {accessCodeInputStatus === 'minLengthUnvalidated' &&
              <Validator type="minLength" value={4} validateFor={formAccessCode}
                displayText={accessCodeErrorText} />
            }
            {accessCodeInputStatus === 'maxLengthUnvalidated' &&
              <Validator type="maxLength" value={4} validateFor={formAccessCode}
                displayText={accessCodeErrorText} />
            }
            {showVerificationStatus && formAccessStatus === 'fail' &&
              <Verifier type="AccessCodeService" status={formAccessStatus !== 'fail'} />
            }
          </div>
          <a href="javascript:;" className={styles.resendLink}
            {...optionals}>
            Resend access code
          </a>
        </div>
      </Modal>
    );
  }

  render() {
    const { submitAnswer, params: { status }, formAccessStatus, form } = this.props;
    return (
      <div>
        <FormHeader submitAnswer={submitAnswer} />
        <div className={styles.flowLine}></div>
        {status !== 'completion' && form && this.renderFormSteps}
        {status !== 'completion' && this.renderTempResponseModal()}
        {status === 'completion' && this.renderFormCompletionSection}
        {formAccessStatus !== 'success' && this.renderAccessResponseModal(formAccessStatus)}
      </div>
    );
  }
}

export default FormInteractive;
