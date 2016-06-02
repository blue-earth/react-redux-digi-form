import React, { Component, PropTypes } from 'react';
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js';
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput.js';
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput.js';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice.js';
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton.js';
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

  static propTypes = {
    primaryColor: PropTypes.string,

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
    nextQuestion: PropTypes.func.isRequired
  };

  static defaultProps = {
    primaryColor: '#4dcceb',
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
      savedValue: props.value
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
    // We only do validation on enter, onChange submits the answer if valid.
    const { savedValue } = this.state;
    const { nextQuestion, isVerifying } = this.props;
    const isValid = this.valueIsValid(savedValue);
    const isVerified = this.valueIsVerified();
    if (isValid && isVerified) nextQuestion();
    this.setState({
      inputState: 'enter'
    });
  }

  valueIsValid(value) {
    const { validations } = this.props;
    var isValid = true;
    for (var i = 0; i < validations.length; i ++) {
      isValid = validateField( validations[i], value );
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
    const { id, type, primaryColor, validations, verificationStatus, isVerifying } = this.props;
    const { inputState, savedValue } = this.state;
    let that = this;

    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'NumberField':
        ChildComponent = ShortTextInput;
        break;
      case 'MultipleChoice':
        ChildComponent = MultipleChoice;
        break;
      case 'LongTextField':
        ChildComponent = LongTextInput;
        break;
      default:
        return false;
    }

    var ChildComponentTemplate = () => {
      return <ChildComponent {...this.props} 
        value={savedValue}
        isDisabled={isVerifying}
        autoFocus={inputState == 'focus' || inputState == 'init'}
        onEnterKey={this.handleEnter.bind(this)}
        onChange={this.handleChange.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onBlur={this.handleBlur.bind(this)} />
    }
    const slideAnimation = new SlideAnimation(200);
    const anim = {
      enter: slideAnimation.enter,
      leave: slideAnimation.leave,
    };

    const filteredValidations = _.filter(validations, function(validation) { 
      return !validateField( validation, savedValue );
    } )
    return (
      <div className={styles.interactiveContainer}>
        <div className="clearfix">
          <div className={styles.leftColumn}>
            <Animate exclusive={true} animation={anim} component="div">
              { (inputState == 'enter')
                ? filteredValidations.map((validation, index) => {
                    return (
                      <Validator {...validation} key={validation.type} validateFor={savedValue} 
                        primaryColor={primaryColor} />
                    )
                  })
                : <div key="null_key"></div>
              }
            </Animate>
            <Animate exclusive={true} animation={anim} component="div">
              {
                _.filter(verificationStatus, {id: id, status: false}).map((verification, index) => {
                  return (
                    <Verifier {...verification} key={verification.type} 
                      primaryColor={primaryColor} />
                  )
                })
              }
            </Animate>
          </div>
        </div>
        <div className={styles.leftColumn}>
          <ChildComponentTemplate />
        </div>
        <div className={styles.rightColumn}>
          <FormEnterButton primaryColor={primaryColor} 
            onClick={this.handleEnter.bind(this)} isDisabled={isVerifying} />
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
