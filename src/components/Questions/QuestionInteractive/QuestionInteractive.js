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
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import AddressInput from '../../QuestionInputs/AddressInput/AddressInput';
import Signature from '../../QuestionInputs/Signature/Signature';
import FileUploadContainer from '../../QuestionInputs/FileUpload/FileUploadContainer';
import {
  valueIsValid
} from 'helpers/validationHelper';
import {
  aggregateVerifications
} from 'helpers/verificationHelpers';

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

    getStoreAnswerByQuestionId: PropTypes.func.isRequired,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.state = {
      'hasError': false
    };
  }

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  handleChange = (value) => {
    console.log('handleChange', value);
    const {changeCurrentState, storeAnswer, question: {id}} = this.props;

    changeCurrentState({
      answerValue: value,
      inputState: 'changed'
    });
    storeAnswer({
      id,
      value
    });
  };

  handleEnterKeyPress = () => {
    const {
      getStoreAnswerByQuestionId,
      handleEnter,
      question
    } = this.props;
    var self = this;
    const answer = getStoreAnswerByQuestionId(question.id);
    // Format Validations
    const isValid = valueIsValid(answer, question.validations);
    if (isValid) {
      // Check Verifications
      var verificationPromises = aggregateVerifications(question.verifications, answer);
      Promise.all(verificationPromises).then(function (verifications) {
        self.setState({
          'hasError': false
        }, function () {
          handleEnter();
        });
      }, function () {
        self.setState({
          'hasError': true
        });
      });
    } else {
      this.setState({
        'hasError': true
      });
    }
  };

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
    const { verifications, value, question, question: { validations } } = this.props;
    console.log('render', validations, verifications);
    var extraProps = {
      autoFocus: true,
      primaryColour: this.context.primaryColour,
      onChange: this.handleChange,
      hasError: this.state.hasError,
      onEnterKey: this.handleEnterKeyPress,
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
