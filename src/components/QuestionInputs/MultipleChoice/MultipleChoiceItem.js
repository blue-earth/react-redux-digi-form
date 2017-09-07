import React, {
  Component,
  PropTypes
} from 'react';
import styles from './MultipleChoice.scss';
import classNames from 'classnames';

class MultipleChoiceItem extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: false
  };

  handleClick = () => {
    const { onClick, label, text } = this.props;
    onClick({ label, text });
  };

  render() {
    const { label, text, active } = this.props;
    const { primaryColour } = this.context;
    const choiceItemClasses = classNames({
      [styles.choiceItem]: true,
      [styles.active]: active
    });

    var optionals = {};
    if (active) {
      optionals['style'] = {
        borderColor: primaryColour
      };
    }
    return (
      <div ref="divForMultipleChoiceItem"
        className={choiceItemClasses}
        onClick={this.handleClick}
        {...optionals}>
        <label className={styles.label}>{label}</label>
        <span className={styles.text}>{text}</span>
      </div>
    );
  }
}

export default MultipleChoiceItem;
