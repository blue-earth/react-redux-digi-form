import React, { Component, PropTypes } from 'react';
import FormHeader from 'components/FormHeader';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap'; // Temp
import FormSection from '../FormSection/FormSection';
import FormRow from '../FormRow/FormRow';
import { groupFormQuestions, SlideAnimation }
  from 'helpers/formInteractiveHelper.js';
import { FORM_AUTOSAVE, FORM_USER_SUBMISSION } from 'redux/modules/formInteractive';
import { findIndexById } from 'helpers/pureFunctions';
import styles from './FormInteractive.scss';
import Animate from 'rc-animate';

class FormInteractive extends Component {

  constructor(props) {
    super(props);
    this.state = {primaryColor: props.primaryColor};
  };

  static childContextTypes = {
    primaryColor: PropTypes.string
  };

  getChildContext() {
    return { primaryColor: this.state.primaryColor };
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
    form: PropTypes.object.isRequired,

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

    // Temporary for modal show up.
    lastFormSubmitURL: PropTypes.string
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
    // set show/hide temp modal
    if (props.lastFormSubmitStatus.requestAction === FORM_USER_SUBMISSION
      && props.lastFormSubmitStatus.result) {
      this.setState({ showTempModal: true });
    }
  }

  componentDidMount() {
    const { submitAnswer } = this.props;
    setInterval(function() {
      submitAnswer(FORM_AUTOSAVE);
    }, 30000);
  }

  sectionStatus(allQuestions, currentQuestionId, questionGroup) {
    const gq = questionGroup.questions;
    const curQueIdx = findIndexById(allQuestions, currentQuestionId);
    const firstGroupIdx = findIndexById(allQuestions, gq[0].id);
    const lastGroupIdx = findIndexById(allQuestions, gq[gq.length - 1].id);

    if (curQueIdx < firstGroupIdx) return 'pending';
    else if (curQueIdx <= lastGroupIdx) return 'active';
    else return 'completed';
  }

  get renderFormSteps() {
    const { form: { questions }, currentQuestionId } = this.props;
    const props = this.props;
    const sectionStatus = this.sectionStatus;
    const questionGroups = groupFormQuestions(questions);

    var slideAnimation = new SlideAnimation(1000);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave,
    };

    return (
      <div className={styles.stepsWrapper}>
        <Animate exclusive={true} animation={anim}>
          {
            questionGroups.map(function(group, index) {
              return (
                <FormSection key={index} questionGroup={group}
                  step={index+1} totalSteps={questionGroups.length}
                  status={sectionStatus(questions, currentQuestionId, group)}  
                  {...props} />
              );
            })
          }
        </Animate>
        <FormRow>
          <div className={styles.helpButtonWrapper}>
            <Button bsStyle="danger" block>Help</Button>
          </div>
        </FormRow>
      </div>
    )
  }

  handleHideTempModal = () => {
    this.setState({'showTempModal': false});
  }
  // Temp Modal for submit response.
  renderTempResponseModal() {
    const { sessionId, id, lastFormSubmitStatus } = this.props;
    const { showTempModal } = this.state;

    return (
      <Modal show={showTempModal} bsSize="large"
        onHide={this.handleHideTempModal}>
        <Modal.Header closeButton>
          <Modal.Title>Form Saved.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here's the URL to restore your session.</p>
          <div className="form-control">{lastFormSubmitStatus.sessionURL}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHideTempModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const { submitAnswer } = this.props;
    return (
      <div>
        <FormHeader submitAnswer={submitAnswer} />
        <div className={styles.flowLine}></div>
        { this.renderFormSteps }
        { this.renderTempResponseModal() }
      </div>
    )
  }
}

export default FormInteractive;
