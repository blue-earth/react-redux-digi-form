import React, {
  PropTypes,
  Component
} from 'react';
import styles from './FloatTextInput.scss';
import classNames from 'classnames/bind';
import { IoAndroidAlert } from 'react-icons/lib/io';

class FloatTextInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    primaryColour: PropTypes.string,
    autoFocus: PropTypes.bool,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string,
    className: PropTypes.string
  }
  static defaultProps = {
    value: '',
    isError: false
  }

  constructor(props) {
    super(props);
    this.state = {
      savedValue: props.value,
      filled: props.value,
      isError: props.isError,
      active: false,
      displayErrorMessage: false
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      isError: props.isError,
      savedValue: props.value
    });
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
      isError: false
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
    const { placeholder, name, errorMessage, autoFocus } = this.props;
    let { filled, active, savedValue, displayErrorMessage, isError } = this.state;
    const cx = classNames.bind(styles);
    return (
      <div className={cx('textInputWrap', this.props.className)}>
        <label
          htmlFor={name}
          className={cx('textInputLabel', {filled: filled, isError: isError})}
          style={this.activeColour}>
          {placeholder}
        </label>
        <input
          id={name}
          type="text"
          value={savedValue}
          className={cx('textInput', {
            isErrorInput: isError,
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
            hide: !isError
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
