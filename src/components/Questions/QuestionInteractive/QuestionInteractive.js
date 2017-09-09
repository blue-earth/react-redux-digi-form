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
    formId: PropTypes.number,
    sessionId: PropTypes.number,
    formTitle: PropTypes.string,
    isInputLocked: PropTypes.bool,
    setInputLocked: PropTypes.func,
    handleChange: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,

    saveForm: PropTypes.func,

    isEditAnswerModal: PropTypes.bool
  };

  static contextTypes = {
    primaryColour: PropTypes.string
  };

  static defaultProps = {
    isInputLocked: false,
    isEditAnswerModal: false
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

  ensureSessionExists = () => {
    const { saveForm } = this.props;
    var self = this;
    return new Promise(function (resolve, reject) {
      if (self.props.sessionId) {
        resolve();
      } else {
        saveForm().then(function () {
          resolve();
        });
      }
    });
  };

  getQuestionInputComponent() {
    var InputComponent = null;
    const { value, question, question: { type } } = this.props;
    var props = {
      primaryColour: this.context.primaryColour,
      onChange: this.props.handleChange,
      compiledQuestion: question,
      handleEnter: this.props.handleEnter,
      isInputLocked: this.props.isInputLocked,
      value: value,
      formId: this.props.formId,
      sessionId: this.props.sessionId,
      formTitle: this.props.formTitle,
      isEditAnswerModal: this.props.isEditAnswerModal
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
        props = Object.assign({}, props, {
          'ensureSessionExists': this.ensureSessionExists
        });
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
