import React, { Component, PropTypes } from 'react';
import styles from './QuestionInstruction.scss';

class QuestionDisplay extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    instruction: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    attachment: React.PropTypes.string
  };

  static defaultProps = {
    instruction: '',
    description: null,
    attachment: null
  };


  renderInstruction() {
    var isRequired = <span>*</span>;

    var ItemTemplate = () => {
      return (
        <div className={styles.instructionTextWrapper}>
          <span className={styles.text}>{this.props.instruction}</span>
        </div>
      )
    };

    return <ItemTemplate />;
  }

  renderDescription() {
    if (this.props.description) {
      var ItemTemplate = () => {
        return (
          <div className={styles.descriptionTextWrapper}
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
    );
  }
}

export default QuestionDisplay;
