import React, { Component, PropTypes } from 'react';
import styles from './ShortTextInput.scss';

class ShortTextInput extends Component {
  static propTypes = {
    primaryColor: PropTypes.string,
    isRequired: PropTypes.bool.isRequired,
    isFocused: PropTypes.bool,
    isDisabled: PropTypes.bool,
    errorText: PropTypes.string,
    placeholderText: PropTypes.string,
    initialValue: PropTypes.string,
    fullWidth: PropTypes.bool,
    type: PropTypes.string,
    minVal: PropTypes.number.isRequired,
    maxVal: PropTypes.number.isRequired,
    onChange: PropTypes.func
  };

  static defaultProps = {
    primaryColor: '#4dcceb',
    isRequired: true,
    isFocused: true,
    isDisabled: false,
    placeholderText: '',
    initialValue: '',
    fullWidth: false,
    minVal: 2,
    maxVal: 20,
    type: 'text'
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

    var inputStyle = {
      color: props.primaryColor
    }
    optionals['style'] = inputStyle

    return (
      <input
        className={styles.textInput}
        minlength={props.minVal}
        maxlength={props.maxVal}
        type={props.type}
        placeholder={props.placeholderText}
        {...optionals}
      />
    )
  }
}

export default ShortTextInput