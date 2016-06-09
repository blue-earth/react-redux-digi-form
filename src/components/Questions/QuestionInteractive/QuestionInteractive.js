import React, { Component, PropTypes } from 'react';
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction';
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput';
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice';
import YesNoChoice from '../../QuestionInputs/YesNoChoice/YesNoChoice';
import Statement from '../../QuestionInputs/Statement/Statement';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import DropdownInput from '../../QuestionInputs/DropdownInput/DropdownInput';
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton';
import Validator from '../../Validator/Validator';
import Verifier from '../../Verifier/Verifier';
import validateField from 'helpers/validationHelper';
import styles from './QuestionInteractive.scss';
import _ from 'lodash';
import Hogan from 'hogan.js';
import { SlideAnimation } from 'helpers/formInteractiveHelper';
import Animate from 'rc-animate';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends Component {
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
      inputState: 'init'
    };
  };

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };
  
  static propTypes = {

    /*
     * validations: Validations required for the question, it is a part of form response.
     */ 
    validations: PropTypes.array,
    
    /*
     * status: Status of current question.
     *         'current' - current active question that is prompted to answer
     *         'next' - the question next to current answer for preview
     *         'prev' - the question prior to current question
     *         'hidden' - the question that won't be shown
     */
    status: PropTypes.oneOf(['current', 'next', 'prev', 'hidden']),

    /*
     * context: context variable, array of {answer_xxx: 'ANSWERED_VALUE'} for replacement by Hogan.js
     */
    context: PropTypes.object,

    /*
     * verificationStatus: Redux state that holds the status of verification, ex. EmondoEmailService
     */
    verificationStatus: PropTypes.array,

    /*
     * isVerifying: Redux state that holds the status whether verification is in prgress
     */
    isVerifying: PropTypes.bool.isRequired,

    /*
     * storeAnswer: Redux action to store the answer value to Redux store.
     */
    storeAnswer: PropTypes.func.isRequired,

    /*
     * nextQuestion: Redux action to move to next question when the current answer is qualified.
     */
    nextQuestion: PropTypes.func.isRequired,

    /*
     * handleEnter: Redux action to handle Enter key or button press, it also handles verification.
     */
    handleEnter: PropTypes.func.isRequired
  };

  static defaultProps = {
    validations: [],
    status: 'current',
    context: {}
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { inputState } = nextState;
    return inputState != 'focus' || (nextProps.isVerifying != this.props.isVerifying);
  }

  componentWillReceiveProps(props) {
    this.setState({
      savedValue: props.value,
      inputState: props.status !== this.props.status ? 'init' : this.state.inputState
    });
  }

  handleFocus(value) {
    this.setState({
      inputState: 'focus',
    });
  }
  
  handleBlur(value) {
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

  handleEnter() {
    // We only do validation and verification on enter, onChange submits the answer if valid.
    const { savedValue } = this.state;
    const { handleEnter, isVerifying } = this.props;
    const isValid = this.valueIsValid(savedValue);
    if (isValid) handleEnter();
    this.setState({
      inputState: 'enter'
    });
  }

  valueIsValid(value) {
    const { validations } = this.props;
    var isValid = true;
    for (var i = 0; i < validations.length; i ++) {
      isValid = validateField( validations[i], value );
      console.log(validations[i])
      if (!isValid) break;
    }

    return isValid;
  }

  valueIsVerified() {
    const { id, verificationStatus, isVerifying } = this.props;
    if (isVerifying) return false;
    const unavailables = _.filter(verificationStatus, {id: id, status: false});
    return unavailables.length == 0;
  }

  compileTemplate(template, context) {
    if (template) {
      var t = Hogan.compile(template);
      return t.render(context);
    } else {
      return '';
    }
  }

  renderQuestionDisplay() {
    const { context, questionInstruction, questionDescription } = this.props;

    return (
      <QuestionInstruction
        instruction={this.compileTemplate(questionInstruction, context)}
        description={this.compileTemplate(questionDescription, context)}
      />
    );
  }

  renderInteractiveInput() {
    var ChildComponent = '';
    const props = this.props;
    const { id, type, validations, verificationStatus, isVerifying, buttonLabel } = props;
    const { inputState, savedValue } = this.state;
    let that = this;
    var inputPosClass = styles.leftColumn;
    var buttonPosClass = styles.rightColumn;

    var extraProps = {
      value: savedValue,
      isDisabled: isVerifying,
      autoFocus: inputState === 'init' || inputState === 'focus' || inputState === 'enter',
      onEnterKey: this.handleEnter.bind(this),
      onChange: this.handleChange.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this)
    };

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
        buttonPosClass = props.allowMultiple ? styles.bottomColumn : styles.noneColumn;
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
        inputPosClass = styles.topColumn;
        buttonPosClass = styles.noneColumn;
        break;
      default:
        return false;
    }

    var ChildComponentTemplate = () => {
      return <ChildComponent {...this.props} {...extraProps} />
    }
    const slideAnimation = new SlideAnimation(200);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave,
    };

    const filteredValidations = _.filter(validations, function(validation) { 
      return !validateField( validation, savedValue );
    } )

    var ValidationsTemplate = () => {
      return (
        <Animate exclusive={true} animation={anim} component="div">
          { (inputState == 'enter')
            ? filteredValidations.map((validation, index) => {
                return (
                  <Validator {...validation} key={validation.type} validateFor={savedValue} />
                )
              })
            : <div key="null_key"></div>
          }
        </Animate>
      );
    }

    var VerificationsTemplate = () => {
      return (
        <Animate exclusive={true} animation={anim} component="div">
          {
            _.filter(verificationStatus, {id: id, status: false}).map((verification, index) => {
              return (
                <Verifier {...verification} key={verification.type} />
              )
            })
          }
        </Animate>
      );
    }
    
    return (
      <div className={styles.interactiveContainer}>
        <div className="clearfix">
          <div className={styles.leftColumn}>
            <ValidationsTemplate />
            <VerificationsTemplate />
          </div>
        </div>
        <div className={inputPosClass}>
          <ChildComponentTemplate />
        </div>
        <div className={buttonPosClass}>
          <FormEnterButton 
            onClick={this.handleEnter.bind(this)}
            buttonLabel={buttonLabel}
            isDisabled={isVerifying} />
        </div>
      </div>
    )
  }

  renderActiveQuestion() {
    return (
      <div className={styles.activeQuestionContainer}>
        {this.renderQuestionDisplay()}
        {this.renderInteractiveInput()}
      </div>
    )
  }
  
  renderNextQuestion() {
    var { questionInstruction, context } = this.props
    return (
      <div>
        <h3 className={styles.neighborInstruction}>
          {this.compileTemplate(questionInstruction, context)}
        </h3>
      </div>
    )
  }
  
  renderPrevQuestion() {
    var { questionInstruction, context } = this.props
    return (
      <div>
        <h3 className={styles.neighborInstruction}>
          {this.compileTemplate(questionInstruction, context)}
        </h3>
      </div>
    )
  }

  render() {
    const { status } = this.props
    if ( status === 'current' )
      return this.renderActiveQuestion();
    else if ( status === 'next' )
      return this.renderNextQuestion();
    else if ( status === 'prev' )
      return this.renderPrevQuestion();
    return false;
  }
}

export default QuestionInteractive;
