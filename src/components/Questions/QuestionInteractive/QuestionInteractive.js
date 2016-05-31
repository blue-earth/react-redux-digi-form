import React, { Component, PropTypes } from 'react'
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js'
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput.js'
import TextInputLong from '../../QuestionInputs/TextInputLong/TextInputLong.js'
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice.js'
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton.js'
import Validator from '../../Validator/Validator.js'
import validateField from 'helpers/validationHelper'
import styles from './QuestionInteractive.scss'
import _ from 'lodash'
import Hogan from 'hogan.js';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      savedValue: '',
      inputState: 'init',
      valueIsValid: true
    }
  }

  static propTypes = {
    primaryColor: PropTypes.string,
    validations: PropTypes.array,
    status: PropTypes.oneOf(['current', 'next', 'prev', 'hidden']),
    context: PropTypes.object,
    storeAnswer: PropTypes.func.isRequired,
    nextQuestion: PropTypes.func.isRequired
  };

  static defaultProps = {
    primaryColor: '#4dcceb',
    validations: [],
    status: 'current',
    context: {}
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { inputState } = nextState
    return inputState != 'focus'
  }

  componentWillReceiveProps({ value }) {
    this.setState({
      savedValue: value
    })
  }

  handleFocus(value) {
    this.setState({
      inputState: 'focus',
    })
  }
  
  handleBlur(value) {
    this.setState({
      inputState: 'blur',
      valueIsValid: this.valueIsValid(value)
    })
  }

  handleChange(value) {
    const { storeAnswer, id } = this.props
    
    this.setState({
      savedValue: value
    })
    
    if (this.valueIsValid(value)) {
      storeAnswer({
        id: id,
        value: value
      })
    }
  }

  handleEnter() {
    // We only do validation on enter, onChange submits the answer if valid.
    const { savedValue } = this.state
    const { nextQuestion } = this.props
    const isValid = this.valueIsValid(savedValue)
    this.setState({
      valueIsValid: isValid
    })
    if (isValid) nextQuestion()
  }

  valueIsValid(value) {
    const { validations } = this.props
    var isValid = true
    for (var i = 0; i < validations.length; i ++) {
      isValid = validateField( validations[i], value )
      if (!isValid) break
    }

    return isValid
  }

  compileTemplate(template, context) {
    if (template) {
      var t = Hogan.compile(template);
      return t.render(context)
    } else {
      return ''
    }
  }

  renderQuestionDisplay() {
    const { context, questionInstruction, questionDescription } = this.props

    return (
      <QuestionInstruction
        instruction={this.compileTemplate(questionInstruction, context)}
        description={this.compileTemplate(questionDescription, context)}
      />
    )
  }

  renderInteractiveInput() {
    var ChildComponent = ''
    const { type, primaryColor, validations } = this.props
    const { inputState, savedValue } = this.state
    let that = this

    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
      case 'NumberField':
        ChildComponent = ShortTextInput
        break
      case 'MultipleChoice':
        ChildComponent = MultipleChoice
        break
      case 'LongTextField':
        ChildComponent = TextInputLong
        break
    }

    var ChildComponentTemplate = () => {
      return <ChildComponent {...this.props} 
        value={savedValue}
        autoFocus={inputState == 'focus' || inputState == 'init'}
        onEnterKey={this.handleEnter.bind(this)}
        onChange={this.handleChange.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onBlur={this.handleBlur.bind(this)} />
    }

    return (
      <div className={styles.interactiveContainer}>
        { (inputState == 'blur') &&
          <div className="clearfix">
            <div className={styles.leftColumn}>
              {
                validations.map(function(validation, index) {
                  return (
                    <Validator {...validation} key={index} validateFor={savedValue} 
                      primaryColor={primaryColor} />
                  )
                })
              }
            </div>
          </div>
        }
        <div className={styles.leftColumn}>
          <ChildComponentTemplate />
        </div>
        <div className={styles.rightColumn}>
          <FormEnterButton primaryColor={primaryColor} 
            onClick={this.handleEnter.bind(this)} />
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
      return this.renderActiveQuestion()
    else if ( status === 'next' )
      return this.renderNextQuestion()
    else if ( status === 'prev' )
      return this.renderPrevQuestion()
    return false
  }
}

export default QuestionInteractive
