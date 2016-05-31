import React, { Component, PropTypes } from 'react';
import styles from './ShortTextInput.scss';

class ShortTextInput extends Component {
  static propTypes = {
    placeholderText: PropTypes.string,
    initialValue: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    primaryColor: PropTypes.string,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    primaryColor: '#4dcceb',
    placeholderText: '',
    initialValue: '',
    fullWidth: false,
    type: 'text',
  };

  constructor(props) {
    super(props)
    this.state = {
      savedValue: typeof props.value !== 'undefined' ? props.value : ''
    }
  }

  handleChange(event) {
    const { onChange } = this.props
    let value = event.target.value

    this.setState({
      savedValue: value
    })

    if (typeof onChange === 'function') onChange(value)
  }

  handleFocus(event) {
    const { onFocus } = this.props
    let value = event.target.value

    this.setState({
      savedValue: value
    })

    if (typeof onFocus === 'function') onFocus(value)
  }

  handleBlur(event) {
    const { onBlur } = this.props
    let value = event.target.value

    this.setState({
      savedValue: value
    })

    if (typeof onBlur === 'function') onBlur(value)
  }

  handleKeyDown(event) {
    const { onEnterKey } = this.props
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey()
      this.refs.input.blur()
    }
  }

  inputType(type) {
    switch (type) {
      case 'EmailField':
        return 'email'
      case 'NumberField':
        return 'number'
      default:
        return 'text'
    }
  }

  render() {
    var props = this.props
    var { type, primaryColor, value, autoFocus } = this.props

    var inputStyle = {
      color: primaryColor
    }

    var optionals = {}
    if (props.placeholderText) {
      optionals['placeholder'] = props.placeholderText
    }
    if (props.isDisabled) {
      optionals['disabled'] = 'disabled'
    }

    return (
      <input
        className={styles.textInput}
        type={this.inputType(type)}
        style={inputStyle}
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

export default ShortTextInput
