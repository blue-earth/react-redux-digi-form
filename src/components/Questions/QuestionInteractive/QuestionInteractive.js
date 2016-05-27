import React, { Component, PropTypes } from 'react';
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js';
import TextInputShort from '../../QuestionInputs/TextInputShort/TextInputShort.js';
import TextInputLong from '../../QuestionInputs/TextInputLong/TextInputLong.js';
import TextInputEmail from '../../QuestionInputs/TextInputEmail/TextInputEmail.js';
import MultipleChoice from '../../QuestionInputs/MultipleChoice/MultipleChoice.js';
import FormEnterButton from '../../Buttons/FormEnterButton/FormEnterButton.js';
import styles from './QuestionInteractive.scss';

/**
 * This component joins QuestionDisplay and one of the question input
 *
 */

class QuestionInteractive extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    status: PropTypes.oneOf(['current', 'next', 'prev', 'hidden']),
  };

  static defaultProps = {
    status: 'current'
  };

  renderQuestionDisplay() {
    var props = this.props;

    return (
      <QuestionInstruction
        instruction={props.questionInstruction}
        description={props.questionDescription}
      />
    )
  }

  renderInteractiveInput() {
    var ChildComponent = '';

    switch (this.props.type) {
      case 'ShortText':
        ChildComponent = TextInputShort;
        break;
      case 'MultipleChoice':
        ChildComponent = MultipleChoice;
        break;
      case 'Email':
        ChildComponent = TextInputEmail;
        break;
      case 'LongText':
        ChildComponent = TextInputLong;
        break;
    }

    var ChildComponentTemplate = () => {
      return <ChildComponent {...this.props} />
    };

    return (
      <div className={styles.interactiveContainer}>
        <div className={styles.leftColumn}>
          <ChildComponentTemplate />
        </div>
        <div className={styles.rightColumn}>
          <FormEnterButton />
        </div>
      </div>
    );
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
    var props = this.props;
    return (
      <div>
        <h3 className={styles.neighborInstruction}>{props.questionInstruction}</h3>
      </div>
    )
  }
  
  renderPrevQuestion() {
    var props = this.props;
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

export default QuestionInteractive;



