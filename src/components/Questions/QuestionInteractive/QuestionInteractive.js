import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import styles from './QuestionInteractive.scss';
import FloatTextInput from '../../QuestionInputs/FloatTextInput';
import DropdownInput from '../../QuestionInputs/Dropdown';
import FieldError from '../../QuestionInputs/FieldError';
import QuestionInstruction from 'components/Questions/QuestionInstruction';
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice';
import YesNoChoice from '../../QuestionInputs/YesNoChoice/YesNoChoice';
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import AddressInput from '../../QuestionInputs/AddressInput/AddressInput';
import Signature from '../../QuestionInputs/Signature/Signature';
import FileUploadContainer from '../../QuestionInputs/FileUpload/FileUploadContainer';
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

    handleEnter: PropTypes.func.isRequired,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  handleChange = (value) => {
    const {changeCurrentState, storeAnswer, question: {id, validations}} = this.props;

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
  };

  shouldShowValidation() {
    return this.props.inputState === 'enter';
  }

  get hasError() {
    const {verifications, value, question: { validations }} = this.props;
    const failedValidations = _.filter(validations, function (validation) {
      return !validateField(validation, value);
    });
    const failedVerifications = _.filter(verifications, {status: false});
    return (this.shouldShowValidation() && failedValidations.length > 0) || failedVerifications.length > 0;
  }

  getQuestionInputComponent() {
    const { question: { type } } = this.props;
    var InputComponent = null;
    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'NumberField':
        InputComponent = FloatTextInput;
        break;
      case 'MultipleChoice':
        InputComponent = MultipleChoice;
        break;
      case 'YesNoChoiceField':
        InputComponent = YesNoChoice;
        break;
      case 'LongTextField':
        InputComponent = LongTextInput;
        break;
      case 'StatementField':
        InputComponent = Statement;
        break;
      case 'PhoneNumberField':
        InputComponent = PhoneNumberInput;
        break;
      case 'DropdownField':
        InputComponent = DropdownInput;
        break;
      case 'DateField':
        InputComponent = DateInput;
        break;
      case 'AddressField':
        InputComponent = AddressInput;
        break;
      case 'SignatureField':
        InputComponent = Signature;
        break;
      case 'FileUploadField':
        InputComponent = FileUploadContainer;
        break;
      default:
        InputComponent = (<p>`Question input not found for ${type}`</p>);
    }
    return InputComponent;
  }

  render() {
    const { handleEnter, verifications, value, question, question: { validations } } = this.props;
    var extraProps = {
      autoFocus: true,
      primaryColour: this.context.primaryColour,
      onChange: this.handleChange,
      hasError: this.hasError,
      onEnterKey: handleEnter,
      errorMessage: <FieldError
        value={value} validations={validations} verifications={verifications} />
    };
    const InputComponent = this.getQuestionInputComponent();
    return (
      <div className={styles.wrapper}>
        <QuestionInstruction
          instruction={question.questionInstruction}
          description={question.questionDescription}
          />
        <InputComponent {...this.props} {...extraProps} />
      </div>
    );
  }
}

export default QuestionInteractive;
