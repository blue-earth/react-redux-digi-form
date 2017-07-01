import React, {
  PropTypes,
  Component
} from 'react';
import styles from './FloatTextInput.scss';
import classNames from 'classnames/bind';
import { IoAndroidAlert } from 'react-icons/lib/io';

class FloatTextInput extends Component {
  static propTypes = {
    placeholderText: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    primaryColour: PropTypes.string,
    autoFocus: PropTypes.bool,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string,
    extraClass: PropTypes.string,
    type: PropTypes.string
  }
  static defaultProps = {
    hasError: false,
    placeholderText: 'Label',
    type: 'text',
    value: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      savedValue: props.value,
      filled: props.value,
      hasError: props.hasError,
      active: false,
      displayErrorMessage: false
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      hasError: props.hasError,
      savedValue: props.value
    });
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
  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      savedValue: value
    });
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }
  handleFocus = (event) => {
    if (this.state.savedValue.length === 0) {
      this.setState({
        filled: true
      });
    }
    this.setState({
      active: true
    });
  }
  handleBlur = (event) => {
    if (this.state.savedValue.length === 0) {
      this.setState({
        filled: false
      });
    }
    this.setState({
      active: false,
      hasError: false
    });
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  }
  handleErrorOver = (event) => {
    this.setState({
      displayErrorMessage: true
    });
  }
  handleErrorOut = (event) => {
    this.setState({
      displayErrorMessage: false
    });
  }
  get activeColour() {
    if (this.state.active) {
      return {
        color: this.props.primaryColour
      };
    }
    return null;
  }
  get activeBorderColour() {
    if (this.state.active) {
      return {
        borderColor: this.props.primaryColour
      };
    }
    return null;
  }
  render() {
    const { placeholderText, name, errorMessage, autoFocus, extraClass, type } = this.props;
    let { filled, active, savedValue, displayErrorMessage, hasError } = this.state;
    const cx = classNames.bind(styles); // eslint-disable-line
    return (
      <div className={cx('textInputWrap', extraClass)}>
        <label
          htmlFor={name}
          className={cx('textInputLabel', { filled: filled, hasError: hasError })}
          style={this.activeColour}>
          {placeholderText}
        </label>
        <input
          id={name}
          type={this.inputType(type)}
          value={savedValue}
          className={cx('textInput', {
            isErrorInput: hasError,
            filledInput: active || filled
          })}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          style={this.activeBorderColour}
          autoFocus={autoFocus}
        />
        <div className={cx('errorIconWrapper')} onMouseOver={this.handleErrorOver} onMouseOut={this.handleErrorOut}>
          <IoAndroidAlert className={cx({
            hide: !hasError
          })} />
          <div className={cx('errorTip', {
            'hide': !displayErrorMessage
          })}>
            <div className={cx('errorTipArrow')}></div>
            <div className={cx('errorTipInner')}>
              {errorMessage}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FloatTextInput;
