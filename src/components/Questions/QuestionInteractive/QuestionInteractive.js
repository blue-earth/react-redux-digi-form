import React, { Component, propTypes } from 'react';
import QuestionInstruction from '../QuestionInstruction/QuestionInstruction.js';
import TextInputShort from '../../QuestionInputs/TextInputShort/TextInputShort.js';
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

  };

  static defaultProps = {

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

  render() {
    return (
      <div>
        {this.renderQuestionDisplay()}
        {this.renderInteractiveInput()}
      </div>
    )
  }
}

export default QuestionInteractive;



