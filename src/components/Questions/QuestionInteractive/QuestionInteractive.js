import React, { Component, PropTypes } from 'react'
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js'
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput.js'
import LongTextInput from '../../QuestionInputs/LongTextInput/LongTextInput.js'
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
      validateFor: '',
      inputState: 'init',
      isValid: true
    }
  }

  static propTypes = {
    primaryColor: PropTypes.string,
    validations: PropTypes.array,
    status: PropTypes.oneOf(['current', 'next', 'prev', 'hidden']),
    context: PropTypes.object,
    storeAnswer: PropTypes.func.isRequired
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
      validateFor: value
    })
  }

  handleBlur(value) {
    this.setState({
      inputState: 'blur',
      validateFor: value
    })
    this.checkValidField()
  }

  handleChange(value) {
    this.setState({
      savedValue: value,
    })
  }

  handleEnter() {
    // Will handle Verification and save answer.
    const { storeAnswer, id } = this.props

    this.checkValidField(function() {
      if (this.state.isValid) {
        storeAnswer({
          id: id,
          value: this.state.savedValue
        })
      }
    })

    console.log("handle verification and submit")
  }

  checkValidField(callback) {
    const { validations } = this.props
    const { savedValue } = this.state
    var isValid = true
    for (var i = 0; i < validations.length; i ++) {
      isValid = validateField( validations[i], savedValue )
      if (!isValid) break
    }

    this.setState({
      isValid: isValid
    }, callback)
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
    const { inputState, savedValue, validateFor } = this.state
    let that = this

    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
        ChildComponent = ShortTextInput
        break
      case 'MultipleChoice':
        ChildComponent = MultipleChoice
        break
      case 'LongTextField':
        ChildComponent = LongTextInput
        break
    }

    var ChildComponentTemplate = () => {
      return <ChildComponent {...this.props}
        value={savedValue}
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
                    <Validator {...validation} key={index} validateFor={validateFor}
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
    return (<div></div>)
  }
}

export default QuestionInteractive



