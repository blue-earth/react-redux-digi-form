import React, { Component, PropTypes } from 'react'
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js'
import ShortTextInput from '../../QuestionInputs/ShortTextInput/ShortTextInput.js'
import TextInputLong from '../../QuestionInputs/TextInputLong/TextInputLong.js'
import TextInputEmail from '../../QuestionInputs/TextInputEmail/TextInputEmail.js'
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice.js'
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton.js'
import Validator from '../../Validator/Validator.js'
import styles from './QuestionInteractive.scss'

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
    }
  }

  static propTypes = {
    primaryColor: PropTypes.string,
    validations: PropTypes.array,
    status: PropTypes.oneOf(['current', 'next', 'prev', 'hidden']),
  };

  static defaultProps = {
    primaryColor: '#4dcceb',
    validations: [],
    status: 'current',
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
      savedValue: value
    })
  }
  
  handleBlur(value) {
    this.setState({
      inputState: 'blur',
      savedValue: value
    })
  }

  handleChange(value) {
    this.setState({
      savedValue: value,
    })
  }
  
  handleSubmit() {
    // Will handle Verification and save answer.
    console.log("handle verification and submit")
  }

  renderQuestionDisplay() {
    var props = this.props

    return (
      <QuestionInstruction
        instruction={props.questionInstruction}
        description={props.questionDescription}
      />
    )
  }

  renderInteractiveInput() {
    var ChildComponent = ''
    const { type, primaryColor, validations } = this.props
    const { inputState, savedValue } = this.state

    switch (type) {
      case 'ShortTextField':
      case 'EmailField':
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
        onEnterKey={this.handleSubmit.bind(this)}
        // onChange={this.handleChange.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onBlur={this.handleBlur.bind(this)} />
    }

    return (
      <div className={styles.interactiveContainer}>
        { (inputState == 'blur') &&
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
        }
        <div className={styles.leftColumn}>
          <ChildComponentTemplate />
        </div>
        <div className={styles.rightColumn}>
          <FormEnterButton primaryColor={primaryColor} 
            onClick={this.handleSubmit.bind(this)} />
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
    var props = this.props
    return (
      <div>
        <h3 className={styles.neighborInstruction}>{props.questionInstruction}</h3>
      </div>
    )
  }
  
  renderPrevQuestion() {
    var props = this.props
    return (
      <div>
        <h3 className={styles.neighborInstruction}>{props.questionInstruction}</h3>
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



