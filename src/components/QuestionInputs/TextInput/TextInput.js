import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './TextInput.scss';

class TextInput extends React.Component {
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
              styleName="text-input"
              min={props.minVal}
              max={props.maxVal}
              type={props.type}
              placeholder={props.placeholderText}
              {...optionals}
          />
      )
  }
}

TextInput.propTypes = {
    isRequired: React.PropTypes.bool.isRequired,
    isFocused: React.PropTypes.bool,
    isDisabled: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    type: React.PropTypes.string,
    minVal: React.PropTypes.number.isRequired,
    maxVal: React.PropTypes.number.isRequired
};

TextInput.defaultProps = {
    isRequired: true,
    isFocused: true,
    isDisabled: false,
    placeholderText: '',
    initialValue: '',
    fullWidth: false,
    type: 'text',
    minVal: 2,
    maxVal: 20
};

export default CSSModules(TextInput, styles);



