import React, {
  PropTypes,
  Component
} from 'react';
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import styles from './FloatTextInput.scss';
import classNames from 'classnames/bind';
import { IoAndroidAlert } from 'react-icons/lib/io';

class FloatTextInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onEnterKey: PropTypes.func,
    primaryColour: PropTypes.string,
    autoFocus: PropTypes.bool,
    hasError: PropTypes.bool,
    isDisabled: PropTypes.bool,
    errorMessage: PropTypes.element,
    errorPlacement: PropTypes.string,
    extraClass: PropTypes.string,
    type: PropTypes.string,
    refName: PropTypes.string,
    backgroundColour: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg'])
  }
  static defaultProps = {
    primaryColour: '#3893d0',
    errorPlacement: 'bottom',
    hasError: false,
    isDisabled: false,
    placeholder: '',
    type: 'text',
    value: '',
    size: 'lg'
  }

  static counter = 0;

  constructor(props) {
    super(props);
    this.state = {
      savedValue: props.value,
      filled: props.value,
      hasError: props.hasError,
      active: false,
      inputId: FloatTextInput.counter ++
    };
  }
  componentDidMount() {
    const { hasError, autoFocus } = this.props;
    const input = this.refs.input;
    if (hasError) {
      this.refs.errorMessage.show();
    }
    input.blur();
    if (autoFocus) {
      setTimeout(() => input.focus(), 10);
    }
  }
  componentWillReceiveProps(props) {
    if (props.hasError) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
    this.setState({
      hasError: props.hasError,
      savedValue: props.value
    });
    if (!this.state.active) {
      this.setState({
        filled: props.value && props.value.length > 0
      });
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
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
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
    this.refs.errorMessage.hide();
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  }
  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  }
  get activeColour() {
    const { backgroundColour } = this.props;
    let style = { backgroundColor: backgroundColour };
    if (this.state.active) {
      return Object.assign(style, {
        color: this.props.primaryColour
      });
    }
    return style;
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
    const {
      placeholder,
      label,
      name,
      errorMessage,
      extraClass,
      type,
      isDisabled,
      size,
      errorPlacement
    } = this.props;
    let { filled, active, savedValue, hasError, inputId } = this.state;
    const cx = classNames.bind(styles); // eslint-disable-line
    const controlId = name || `floatTextInput_${inputId}`;
    const tooltip = (
      <Tooltip className="floatTextInputTooltip" id={`tooltipQuestion_${inputId}`}>
        {errorMessage}
      </Tooltip>
    );
    return (
      <div className={cx('textInputWrap', size, extraClass)}>
        <label
          htmlFor={controlId}
          className={cx('textInputLabel', {
            filled: filled && placeholder.length === 0,
            hasError: hasError,
            hide: filled && placeholder.length > 0
          })}
          style={this.activeColour}>
          { label || placeholder }
        </label>
        <input
          id={controlId}
          type={this.inputType(type)}
          value={savedValue}
          ref="input"
          className={cx('textInput', {
            isErrorInput: hasError,
            filledInput: active || filled,
            disabled: isDisabled
          })}
          disabled={isDisabled}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          style={this.activeBorderColour}
          placeholder=""
        />
        <OverlayTrigger ref="errorMessage" placement={errorPlacement} overlay={tooltip} trigger={['hover', 'focus']}>
          <div className={cx('errorIconWrapper')}>
            <IoAndroidAlert className={cx({
              hide: !hasError
            })} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

export default FloatTextInput;
