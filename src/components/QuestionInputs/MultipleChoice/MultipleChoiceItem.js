import React, { Component, PropTypes} from 'react';
import styles from './MultipleChoice.scss';
import classNames from 'classnames';

class MultipleChoiceItem extends Component {

  constructor(props) {
    super(props);
  }

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: false
  };

  handleClick = () => {
    const { onClick, label, text } = this.props;
    onClick({ label, text });
  }

  handleKeyDown = (event) => {
    if (event.keyCode == 32 || event.keyCode == 13) {
      this.handleClick();
    }
  }

  render() {
    const { label, text, onClick, active, disabled } = this.props;
    const { primaryColor } = this.context;
    
    const choiceItemClasses = classNames({
      [styles.choiceItem]: true,
      [styles.active]: active,
      [styles.disabled]: disabled
    });
    
    var optionals = {};
    if (active) {
      optionals['style'] = {
        borderColor: primaryColor
      };
    }
    if (!disabled) {
      optionals['onClick'] = this.handleClick
      optionals['onKeyDown'] = this.handleKeyDown
    }

    return (
      <div className={choiceItemClasses} tabIndex={0} {...optionals}>
        <label className={styles.label}>{label}</label>
        <span className={styles.text}>{text}</span>
      </div>
    )
  }
}

export default MultipleChoiceItem
