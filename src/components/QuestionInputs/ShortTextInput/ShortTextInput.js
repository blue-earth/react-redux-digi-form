import React, { Component, PropTypes } from 'react';
import styles from './ShortTextInput.scss';
import classNames from 'classnames';

class ShortTextInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    placeholderText: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    isReadOnly: PropTypes.bool,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    placeholderText: '',
    fullWidth: true,
    value:'',
    type: 'text',
    isDisabled: false,
    isReadOnly: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      savedValue: typeof props.value !== 'undefined' ? props.value : ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.savedValue != this.state.savedValue;
  }

  componentWillReceiveProps(props) {
    this.setState({
      savedValue: props.value
    });
  }

  handleChange = (event) => {
    const { onChange } = this.props;
    let value = event.target.value;

    this.setState({
      savedValue: value
    });

    if (typeof onChange === 'function') onChange(value);
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
      //this.refs.input.blur()
    }
  }

  inputType(type) {
    switch (type) {
      case 'EmailField':
        return 'email';
      case 'NumberField':
        return 'number';
      default:
        return 'text';
    }
  }

  render() {
    var props = this.props;
    var { type, value, autoFocus, fullWidth, placeholderText, 
      isDisabled, isReadOnly } = this.props;
    var { primaryColor } = this.context;
    var optionals = {};

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor
      };
    }
    if (placeholderText) {
      optionals['placeholder'] = placeholderText
    }
    if (isDisabled) {
      optionals['disabled'] = 'disabled'
    }
    if (isReadOnly) {
      optionals['readOnly'] = true
    }

    const inputClasses = classNames({
      [styles.textInput]: true,
      [styles.fullWidth]: fullWidth
    });
    
    return (
      <input
        className={inputClasses}
        type={this.inputType(type)}
        ref="input"
        autoFocus={autoFocus}
        value={this.state.savedValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        {...optionals}
      />
    )
  }
}

export default ShortTextInput;
