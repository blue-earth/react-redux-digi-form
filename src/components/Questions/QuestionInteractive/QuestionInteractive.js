import React, {
  Component,
  PropTypes
} from 'react';
import QuestionInstruction from '../QuestionInstruction';
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput';
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice';
import YesNoChoice from '../../QuestionInputs/YesNoChoice/YesNoChoice';
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DropdownInput from '../../QuestionInputs/DropdownInput/DropdownInput';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import AddressInput from '../../QuestionInputs/AddressInput/AddressInput';
import Signature from '../../QuestionInputs/Signature/Signature';
import Validator from '../../Validator/Validator';
import Verifier from '../../Verifier/Verifier';
import validateField, {
  valueIsValid
} from 'helpers/validationHelper';
import styles from './QuestionInteractive.scss';
import _ from 'lodash';
import { SlideAnimation } from 'helpers/formInteractiveHelper';
import Animate from 'rc-animate';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends Component {
  static propTypes = {

    /*
     * questionId: Current Question ID.
     */
    questionId: PropTypes.number,

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
      'init', 'changed', 'focus', 'blur', 'enter'
    ]).isRequired,

    /*
     * changeCurrentState: Redux action to change the update the current answer value on change,
     * input state to redux store.
     */
    changeCurrentState: PropTypes.func.isRequired,

    /*
     * questionInstruction: Question Instruction
     */
    questionInstruction: PropTypes.string,

    /*
     * questionDescription: Question Description
     */
    questionDescription: PropTypes.string,

    /*
     * type: Question type.
     */
    type: PropTypes.string,

    /*
     * validations: Validations required for the question, it is a part of form response.
     */
    validations: PropTypes.array,

    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array,

    /*
     * isVerifying: Redux state that holds the status whether verification is in prgress
     */
    isVerifying: PropTypes.bool,

    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    /*
     * goToNextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    goToNextQuestion: PropTypes.func.isRequired,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func.isRequired,

    /*
     * allowMultiple: Optional for Multiple Choice, Dropdown
     */
    allowMultiple: PropTypes.bool
  };

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static defaultProps = {
    validations: [],
    isVerifying: false
  };

  constructor(props) {
    super(props);
    this.state = {
      /*
       * ChildComponent: stores the Child Input component class throughout the component life cycle.
       */
      ChildComponent: null
    };
  };

  componentWillMount() {
    this._determineChildComponent();
  }

  _determineChildComponent() {
    var ChildComponent = null;
    const { type } = this.props;
    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'NumberField':
        ChildComponent = ShortTextInput;
        break;
      case 'MultipleChoice':
        ChildComponent = MultipleChoice;
        break;
      case 'YesNoChoiceField':
        ChildComponent = YesNoChoice;
        break;
      case 'LongTextField':
        ChildComponent = LongTextInput;
        break;
      case 'StatementField':
        ChildComponent = Statement;
        break;
      case 'PhoneNumberField':
        ChildComponent = PhoneNumberInput;
        break;
      case 'DropdownField':
        ChildComponent = DropdownInput;
        break;
      case 'DateField':
        ChildComponent = DateInput;
        break;
      case 'AddressField':
        ChildComponent = AddressInput;
        break;
      case 'SignatureField':
        ChildComponent = Signature;
        break;
      default:
        return false;
    }
    this.setState({
      ChildComponent
    });
  }

  handleFocus = () => {
    const { changeCurrentState } = this.props;
    changeCurrentState({
      inputState: 'focus'
    });
  }

  handleBlur = () => {
    const { changeCurrentState } = this.props;
    changeCurrentState({
      inputState: 'blur'
    });
  }

  handleChange = (value) => {
    const { changeCurrentState, storeAnswer, questionId, validations } = this.props;

    changeCurrentState({
      answerValue: value,
      inputState: 'changed'
    });

    if (valueIsValid(value, validations)) {
      storeAnswer({
        id: questionId,
        value: value
      });
    }
  }

  shouldFocus(inputState) {
    return inputState === 'init' || inputState === 'focus' || inputState === 'enter';
  }

  shouldShowValidation(inputState) {
    return inputState === 'enter';
  }

  renderQuestionDisplay() {
    const { questionInstruction, questionDescription } = this.props;

    return (
      <QuestionInstruction
        instruction={questionInstruction}
        description={questionDescription}
      />
    );
  }

  renderInteractiveInput() {
    const { questionId, validations, verificationStatus, isVerifying, handleEnter,
      value, inputState } = this.props;
    const { ChildComponent } = this.state;
    if (ChildComponent === null) return false;

    var extraProps = _.merge({
      value,
      isDisabled: isVerifying,
      autoFocus: this.shouldFocus(inputState),
      onEnterKey: handleEnter,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    }, this.state.extraProps);

    const slideAnimation = new SlideAnimation(200);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave
    };

    const filteredValidations = _.filter(validations, function (validation) {
      return !validateField(validation, value);
    });

    return (
      <div className={styles.inputWrapper}>
        <div className="clearfix">
          <div className={styles.errorsWrapper}>
            <Animate exclusive animation={anim} component="div">
              {this.shouldShowValidation(inputState)
                ? filteredValidations.map((validation, index) => {
                  return (
                    <Validator {...validation} key={validation.type} validateFor={value} />
                    );
                })
                : <div key="null_key"></div>
              }
            </Animate>
            <Animate exclusive animation={anim} component="div">
              {
                _.filter(verificationStatus, {
                  id: questionId,
                  status: false
                }).map((verification, index) => {
                  return (
                    <Verifier {...verification} key={verification.type} />
                  );
                })
              }
            </Animate>
          </div>
        </div>
        <ChildComponent {...this.props} {...extraProps} />
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
