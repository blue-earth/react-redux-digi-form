import React, {
  Component,
  PropTypes
} from 'react';
import styles from './QuestionInteractive.scss';
import QuestionInstruction from 'components/Questions/QuestionInstruction';
import SingularTextInputQuestion from '../../QuestionTypes/SingularTextInputQuestion';
import LongTextQuestion from '../../QuestionTypes/LongTextQuestion';
import NameQuestion from '../../QuestionTypes/NameQuestion';
import DropdownQuestion from '../../QuestionTypes/DropdownQuestion';
import MultipleChoiceQuestion from '../../QuestionTypes/MultipleChoiceQuestion';
import StatementQuestion from '../../QuestionTypes/StatementQuestion';
import PhoneNumberQuestion from '../../QuestionTypes/PhoneNumberQuestion';
import DateQuestion from '../../QuestionTypes/DateQuestion';
import AddressQuestion from '../../QuestionTypes/AddressQuestion';
import FileUpload from '../../QuestionInputs/FileUpload';
import SignatureQuestion from '../../QuestionTypes/SignatureQuestion';

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
     * changeCurrentState: Redux action to change the update the current answer value on change,
     * input state to redux store.
     */
    changeCurrentState: PropTypes.func.isRequired,

    /*
     * verifications: Array of verifications status for the current question, ex. EmondoEmailService
     */
    verifications: PropTypes.array,
    isInputLocked: PropTypes.bool,
    setInputLocked: PropTypes.func,
    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    handleEnter: PropTypes.func.isRequired,

    getStoreAnswerByQuestionId: PropTypes.func.isRequired,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired,

    formId: PropTypes.number,
    sessionId: PropTypes.number,
    formTitle: PropTypes.string
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  static defaultProps = {
    isInputLocked: false
  };

  handleChange = (value) => {
    const {changeCurrentState, storeAnswer, question: {id}} = this.props;
    changeCurrentState({
      answerValue: value
    });
    storeAnswer({
      id,
      value
    });
  };

  validateAndVerify(successCb) {
    const inputComponent = this.refs.inputComponent;
    const { setInputLocked } = this.props;
    inputComponent.validate(function (result) {
      if (result) {
        // continue with verification
        if (typeof inputComponent.verify === 'function') {
          setInputLocked(true);
          inputComponent.verify(function (result) {
            if (result) {
              successCb();
            }
            setInputLocked(false);
          });
        } else {
          successCb();
        }
      }
    });
  }

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
      isInputLocked: this.props.isInputLocked,
      value: value,
      formId: this.props.formId,
      sessionId: this.props.sessionId,
      formTitle: this.props.formTitle
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
      case 'NameField':
        InputComponent = NameQuestion;
        break;
      case 'PhoneNumberField':
        InputComponent = PhoneNumberQuestion;
        break;
      case 'StatementField':
        InputComponent = StatementQuestion;
        break;
      case 'LongTextField':
        InputComponent = LongTextQuestion;
        break;
      case 'MultipleChoice':
        InputComponent = MultipleChoiceQuestion;
        break;
      case 'DropdownField':
        InputComponent = DropdownQuestion;
        break;
      case 'DateField':
        InputComponent = DateQuestion;
        break;
      case 'AddressField':
        InputComponent = AddressQuestion;
        break;
      case 'SignatureField':
        InputComponent = SignatureQuestion;
        break;
      case 'FileUploadField':
        InputComponent = FileUpload;
        break;
      default:
        InputComponent = (<p>`Question input not found for ${type}`</p>);
    }
    return (<InputComponent ref="inputComponent" {...props} />);
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
