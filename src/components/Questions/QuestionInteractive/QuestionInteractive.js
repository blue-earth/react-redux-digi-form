import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import QuestionInstruction from '../QuestionInstruction';
import InteractiveInput from '../InteractiveInput';
import styles from './QuestionInteractive.scss';
import validateField, {
  valueIsValid
} from 'helpers/validationHelper';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends Component {
  static propTypes = {

    /*
     * question: Current Question.
     */
    question: PropTypes.object,

    /*
     * value: Question answer value
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),

    /*
     * inputState: Redux state to keep the current input state('init', 'changed', 'focus', 'blur', 'enter').
     */
    inputState: PropTypes.oneOf([
      'init', 'changed', 'enter'
    ]).isRequired,

    /*
     * changeCurrentState: Redux action to change the update the current answer value on change,
     * input state to redux store.
     */
    changeCurrentState: PropTypes.func.isRequired,

    /*
     * verifications: Array of verifications status for the current question, ex. EmondoEmailService
     */
    verifications: PropTypes.array,

    /*
     * isVerifying: Redux state that holds the status whether verification is in prgress
     */
    isVerifying: PropTypes.bool,

    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired
  };

  handleChange = (value) => {
    const { changeCurrentState, storeAnswer, question: { id, validations } } = this.props;

    changeCurrentState({
      answerValue: value,
      inputState: 'changed'
    });

    if (valueIsValid(value, validations)) {
      storeAnswer({
        id,
        value
      });
    }
  }

  shouldShowValidation() {
    return this.props.inputState === 'enter';
  }

  get hasError() {
    const { verifications, value, question: { validations } } = this.props;
    const failedValidations = _.filter(validations, function (validation) {
      return !validateField(validation, value);
    });
    const failedVerifications = _.filter(verifications, { status: false });
    return (this.shouldShowValidation() && failedValidations.length > 0) || failedVerifications.length > 0;
  }

  renderQuestionDisplay() {
    const { question } = this.props;

    return (
      <QuestionInstruction
        instruction={question.questionInstruction}
        description={question.questionDescription}
      />
    );
  }

  renderInteractiveInput() {
    const { handleEnter, isVerifying, question, showModal, value, verifications } = this.props;

    return (
      <div className={styles.inputWrapper}>
        <InteractiveInput {..._.omit(question, ['id'])} // Avoid passing id to props.
          isDisabled={isVerifying}
          value={value}
          verifications={verifications}
          hasError={this.hasError}
          onChange={this.handleChange}
          onEnterKey={handleEnter}
          showModal={showModal} />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        {this.renderQuestionDisplay()}
        {this.renderInteractiveInput()}
      </div>
    );
  }
}

export default QuestionInteractive;
