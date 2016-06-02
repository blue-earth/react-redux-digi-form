import React, { Component, PropTypes} from 'react';
import styles from './MultipleChoice.scss';


class MultipleChoiceItem extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
  };

  render() {
    var props = this.props;
    return (
      <div className={styles.choiceItem}>
        <label className={styles.label}>{props.label}</label>
        <span className={styles.text}>{props.text}</span>
      </div>
    )
  }
}

export default MultipleChoiceItem



