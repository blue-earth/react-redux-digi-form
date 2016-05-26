import React, { Component, PropTypes } from 'react';
import Hogan from 'hogan.js';
import styles from './QuestionInstruction.scss';

class QuestionDisplay extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    instruction: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
    attachment: React.PropTypes.string,
    isRequired: React.PropTypes.bool,
    isFocused: React.PropTypes.bool,
    context: React.PropTypes.object
  };

  static defaultProps = {
    instruction: 'No question text line',
    description: null,
    attachment: null,
    isRequired: false,
    isFocused: false,
    context: {}
  };

  compileInstruction() {
    var t = Hogan.compile(this.props.instruction);
    return t.render(this.props.context);
  }

  renderInstruction() {
    var isRequired = <span>*</span>;

    var ItemTemplate = () => {
        return (
            <div className={styles.instructionTextWrapper}>
                <span className={styles.text}>{this.compileInstruction()}</span> {isRequired}
            </div>
        )
    };

    return <ItemTemplate />;
  }

  renderDescription() {
    if (this.props.description) {
      var ItemTemplate = () => {
        return (
          <div
            className={styles.descriptionTextWrapper}
            dangerouslySetInnerHTML={{__html: this.props.description}}>
          </div>
        )
      };

      return <ItemTemplate />;
    }
  }

  renderAttachment() {
    if (this.props.attachment) {
      return (
        <div
          className={styles.attachment}
          dangerouslySetInnerHTML={{__html: this.props.attachment}}>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={styles.questionContainer}>
          {this.renderInstruction()}
          {this.renderDescription()}
      </div>
    )
  }
}

export default QuestionDisplay


