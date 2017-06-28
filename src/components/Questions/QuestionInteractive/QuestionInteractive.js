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
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton';
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
     * buttonLabel: Question button label.
     */
    buttonLabel: PropTypes.string,

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
    storeAnswer: PropTypes.func,

    /*
     * goToNextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    goToNextQuestion: PropTypes.func,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func,

    /*
     * showModal: redux-modal action to show modal
     */
    showModal: PropTypes.func,

    /*
     * allowMultiple: Optional for Multiple Choice, Dropdown
     */
    allowMultiple: PropTypes.bool
  };

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static defaultProps = {
    validations: [],
    isVerifying: false,
    storeAnswer: () => {},
    goToNextQuestion: () => {},
    handleEnter: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      /*
       * ChildComponent: stores the Child Input component class throughout the component life cycle.
       */
      ChildComponent: null,

      /*
       * buttonPosClass: CSS styles for Enter button position
       */
      buttonPosClass: '',

      /*
       * inputPosClass: CSS styles for Input component position
       */
      inputPosClass: '',

      /*
       * extraProps: Component specific extra props.
       */
      extraProps: null
    };
  };

  componentWillMount() {
    this._determineChildComponent();
  }

  _determineChildComponent() {
    var ChildComponent = null;
    const { type, allowMultiple } = this.props;
    var inputPosClass = styles.leftColumn;
    var buttonPosClass = styles.rightColumn;
    var extraProps = {};
    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
        ChildComponent = ShortTextInput;
        break;
      case 'NumberField':
        ChildComponent = ShortTextInput;
        extraProps['fullWidth'] = false;
        inputPosClass = styles.inlineLeft;
        buttonPosClass = styles.inlineRight;
        break;
      case 'MultipleChoice':
        ChildComponent = MultipleChoice;
        inputPosClass = styles.topColumn;
        buttonPosClass = allowMultiple ? styles.bottomColumn : styles.noneColumn;
        break;
      case 'YesNoChoiceField':
        ChildComponent = YesNoChoice;
        inputPosClass = styles.topColumn;
        buttonPosClass = styles.noneColumn;
        break;
      case 'LongTextField':
        ChildComponent = LongTextInput;
        inputPosClass = styles.topColumn;
        buttonPosClass = styles.bottomColumn;
        break;
      case 'StatementField':
        ChildComponent = Statement;
        inputPosClass = styles.topColumn;
        buttonPosClass = styles.bottomColumn;
        break;
      case 'PhoneNumberField':
        ChildComponent = PhoneNumberInput;
        break;
      case 'DropdownField':
        ChildComponent = DropdownInput;
        buttonPosClass = styles.noneColumn;
        break;
      case 'DateField':
        ChildComponent = DateInput;
        inputPosClass = styles.inlineLeft;
        buttonPosClass = styles.inlineRight;
        break;
      case 'AddressField':
        ChildComponent = AddressInput;
        break;
      case 'SignatureField':
        ChildComponent = Signature;
        buttonPosClass = styles.noneColumn;
        break;
      default:
        return false;
    }
    this.setState({
      ChildComponent,
      buttonPosClass,
      inputPosClass,
      extraProps
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
      buttonLabel, value, inputState } = this.props;
    const { ChildComponent, inputPosClass, buttonPosClass } = this.state;
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
      <div className={styles.interactiveContainer}>
        <div className="clearfix">
          <div className={styles.leftColumn}>
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
        <div className={inputPosClass}>
          <ChildComponent {...this.props} {...extraProps} />
        </div>
        <div className={buttonPosClass}>
          <FormEnterButton
            onClick={handleEnter}
            buttonLabel={buttonLabel}
            isDisabled={isVerifying} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.interactiveContainer}>
        {this.renderQuestionDisplay()}
        {this.renderInteractiveInput()}
      </div>
    );
  }
}

export default QuestionInteractive;
