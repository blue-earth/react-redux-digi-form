import React, { Component, PropTypes } from 'react';
import styles from './LongTextInput.scss';

class LongTextInput extends Component {
  static propTypes = {
    isRequired: React.PropTypes.bool.isRequired,
    isFocused: React.PropTypes.bool,
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    minVal: React.PropTypes.number.isRequired,
    maxVal: React.PropTypes.number.isRequired,
    rows: React.PropTypes.number,
    cols: React.PropTypes.number
  };

  static defaultProps = {
    isRequired: true,
    isFocused: true,
    isDisabled: false,
    placeholderText: '',
    initialValue: '',
    fullWidth: false,
    minVal: 2,
    maxVal: 4096,
    rows: 4,
    cols: 50,
  };

  constructor(props) {
    super(props);
    this.state = {
        'value': ''
    }
  }

  render() {
    var props = this.props;
    var optionals = {};
    if (props.isDisabled) {
        optionals['disabled'] = 'disabled'
    }
    if (props.isFocused) {
        optionals['autofocus'] = true;
    }
    if (props.isRequired) {
        optionals['required'] = true;
    }
    return (
      <textarea
          className={styles.textInput}
          rows={props.rows}
          cols={props.cols}
          minlength={props.minVal}
          maxlength={props.maxVal}
          type="text"
          placeholder={props.placeholderText}
          {...optionals}
      />
    )
  }
}

export default TextInputLong



