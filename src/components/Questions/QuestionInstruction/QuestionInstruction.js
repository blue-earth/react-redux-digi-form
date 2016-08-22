import React, {
  Component,
  PropTypes
} from 'react';
import styles from './QuestionInstruction.scss';

class QuestionDisplay extends Component {
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
    const { instruction } = this.props;
    var ItemTemplate = () => {
      return (
        <div className={styles.instructionTextWrapper}
          dangerouslySetInnerHTML={{__html: instruction}}>
        </div>
      );
    };

    return <ItemTemplate />;
  }

  renderDescription() {
    const { description } = this.props;
    if (description) {
      var ItemTemplate = () => {
        return (
          <div className={styles.descriptionTextWrapper}
            dangerouslySetInnerHTML={{__html: description}}>
          </div>
        );
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
