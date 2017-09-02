import React, {
  Component,
  PropTypes
} from 'react';
import styles from './QuestionInteractive.scss';
import QuestionInstruction from 'components/Questions/QuestionInstruction';
import SingularTextInputQuestion from '../../QuestionTypes/SingularTextInputQuestion';
import SignatureQuestion from '../../QuestionTypes/SignatureQuestion';
import DropdownInput from '../../QuestionInputs/Dropdown';
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice';
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import AddressInput from '../../QuestionInputs/AddressInput/AddressInput';
import FileUploadContainer from '../../QuestionInputs/FileUpload/FileUploadContainer';

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

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  handleChange = (value) => {
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

  getQuestionInputComponent() {
    var InputComponent = null;
    const { value, question, question: { type },
      getStoreAnswerByQuestionId, storeAnswer, changeCurrentState } = this.props;
    var props = {
      primaryColour: this.context.primaryColour,
      onChange: this.handleChange,
      compiledQuestion: question,
      getStoreAnswerByQuestionId: getStoreAnswerByQuestionId,
      changeCurrentState: changeCurrentState,
      storeAnswer: storeAnswer,
      handleEnter: this.props.handleEnter,
      value: value
    };

    switch (type) {
      case 'ShortTextField':
        InputComponent = SingularTextInputQuestion;
        props = Object.assign({}, props, {
          'type': 'text'
        });
        break;
      case 'EmailField':
        InputComponent = SingularTextInputQuestion;
        props = Object.assign({}, props, {
          'type': 'email'
        });
        break;
      case 'NumberField':
        InputComponent = SingularTextInputQuestion;
        props = Object.assign({}, props, {
          'type': 'number'
        });
        break;
      case 'PhoneNumberField':
        InputComponent = PhoneNumberInput;
        break;
      case 'StatementField':
        InputComponent = Statement;
        break;
      case 'LongTextField':
        InputComponent = LongTextInput;
        break;
      case 'MultipleChoice':
        InputComponent = MultipleChoice;
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
        InputComponent = SignatureQuestion;
        break;
      case 'FileUploadField':
        InputComponent = FileUploadContainer;
        break;
      default:
        InputComponent = (<p>`Question input not found for ${type}`</p>);
    }
    return (<InputComponent {...props} />);
  }

  render() {
    const { question } = this.props;
    return (
      <div className={styles.wrapper}>
        <QuestionInstruction
          instruction={question.questionInstruction}
          description={question.questionDescription}
        />
        {this.getQuestionInputComponent()}
      </div>
    );
  }
}

export default QuestionInteractive;
