import React, { Component, PropTypes } from 'react';
import styles from './TextInputShort.scss';

class TextInputShort extends Component {
  static propTypes = {
    isRequired: React.PropTypes.bool.isRequired,
    isFocused: React.PropTypes.bool,
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    minVal: React.PropTypes.number.isRequired,
    maxVal: React.PropTypes.number.isRequired
  };

  static defaultProps = {
      isRequired: true,
      isFocused: true,
      isDisabled: false,
      placeholderText: '',
      initialValue: '',
      fullWidth: false,
      minVal: 2,
      maxVal: 20
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
          <input
              className={styles.textInput}
              min={props.minVal}
              max={props.maxVal}
              type="text"
              placeholder={props.placeholderText}
              {...optionals}
          />
      )
  }
}



export default TextInputShort



