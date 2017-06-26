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
import validateField from 'helpers/validationHelper';
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
     * value: Question answer value
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]),

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
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func,

    allowMultiple: PropTypes.bool,

    id: PropTypes.number,

    questionInstruction: PropTypes.string,

    questionDescription: PropTypes.string
  };

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static defaultProps = {
    validations: [],
    isVerifying: false,
    storeAnswer: () => {},
    nextQuestion: () => {},
    handleEnter: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      /*
       * savedValue: current answer value, it is saved to store when validation passes.
       */
      savedValue: props.value,

      /*
       * inputState: one of 'init', 'focus', 'blur', 'enter'
       */
      inputState: 'init',

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

  componentWillReceiveProps(props) {
    const { inputState } = this.state;
    this.setState({
      savedValue: props.value,
      inputState: this.props.id !== props.id ? 'init' : inputState
    });
  }

  handleFocus() {
    this.setState({
      inputState: 'focus'
    });
  }

  handleBlur() {
    this.setState({
      inputState: 'blur'
    });
  }

  handleChange(value) {
    const { storeAnswer, id } = this.props;

    this.setState({
      savedValue: value
    });

    if (this.valueIsValid(value)) {
      storeAnswer({
        id: id,
        value: value
      });
    }
  }

  handleEnter = () => {
    // We only do validation and verification on enter, onChange submits the answer if valid.
    const { savedValue } = this.state;
    const { handleEnter } = this.props;
    const isValid = this.valueIsValid(savedValue);
    if (isValid) handleEnter();
    this.setState({
      inputState: 'enter'
    });
  }

  valueIsValid(value) {
    const { validations } = this.props;
    var isValid = true;
    for (var i = 0; i < validations.length; i++) {
      isValid = validateField(validations[i], value);
      if (!isValid) break;
    }

    return isValid;
  }

  valueIsVerified() {
    const { id, verificationStatus, isVerifying } = this.props;
    if (isVerifying) return false;
    const unavailables = _.filter(verificationStatus, {id: id, status: false});
    return unavailables.length === 0;
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
    const { id, validations, verificationStatus, isVerifying, buttonLabel } = this.props;
    const { ChildComponent, inputPosClass, buttonPosClass, inputState, savedValue } = this.state;

    if (ChildComponent === null) return false;

    var extraProps = _.merge({
      value: savedValue,
      isDisabled: isVerifying,
      autoFocus: inputState === 'init' || inputState === 'focus' || inputState === 'enter',
      onEnterKey: this.handleEnter.bind(this),
      onChange: this.handleChange.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this)
    }, this.state.extraProps);

    const slideAnimation = new SlideAnimation(200);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave
    };

    const filteredValidations = _.filter(validations, function (validation) {
      return !validateField(validation, savedValue);
    });

    return (
      <div className={styles.interactiveContainer}>
        <div className="clearfix">
          <div className={styles.leftColumn}>
            <Animate exclusive animation={anim} component="div">
              {(inputState === 'enter')
                ? filteredValidations.map((validation, index) => {
                  return (
                    <Validator {...validation} key={validation.type} validateFor={savedValue} />
                    );
                })
                : <div key="null_key"></div>
              }
            </Animate>
            <Animate exclusive animation={anim} component="div">
              {
                _.filter(verificationStatus, {id: id, status: false}).map((verification, index) => {
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
            onClick={this.handleEnter}
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
