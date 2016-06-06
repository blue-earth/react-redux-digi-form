import React, { Component, PropTypes } from 'react';
import styles from './ShortTextInput.scss';

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
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    placeholderText: '',
    fullWidth: false,
    type: 'text',
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

  handleChange(event) {
    const { onChange } = this.props;
    let value = event.target.value;

    this.setState({
      savedValue: value
    });

    if (typeof onChange === 'function') onChange(value);
  }

  handleFocus(event) {
    const { onFocus } = this.props;
    let value = event.target.value;

    this.setState({
      savedValue: value
    });

    if (typeof onFocus === 'function') onFocus(value);
  }

  handleBlur(event) {
    const { onBlur } = this.props;
    let value = event.target.value;

    this.setState({
      savedValue: value
    });

    if (typeof onBlur === 'function') onBlur(value);
  }

  handleKeyDown(event) {
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
    var { type, value, autoFocus } = this.props;
    var { primaryColor } = this.context;
    var optionals = {};

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor
      };
    }
    if (props.placeholderText) {
      optionals['placeholder'] = props.placeholderText
    };
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled'
    };

    return (
      <input
        className={styles.textInput}
        type={this.inputType(type)}
        ref="input"
        autoFocus={autoFocus}
        value={this.state.savedValue}
        onChange={this.handleChange.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        onFocus={this.handleFocus.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        {...optionals}
      />
    )
  }
}

export default ShortTextInput;
