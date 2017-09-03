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

const cx = classNames.bind(styles);

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
    isDisabled: PropTypes.bool,
    errorPlacement: PropTypes.string,
    extraClass: PropTypes.string,
    type: PropTypes.string,
    backgroundColour: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    errors: PropTypes.array
  }

  static defaultProps = {
    primaryColour: '#3893d0',
    errorPlacement: 'bottom',
    isDisabled: false,
    value: '',
    placeholder: '',
    label: '',
    type: 'text',
    size: 'lg',
    errors: []
  }

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      filled: props.value,
      inputId: FloatTextInput.counter ++
    };
  }

  get isFilled() {
    return this.props.value.length > 0;
  };

  get hasError() {
    return this.props.errors.length > 0;
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    const input = this.refs.input;
    if (this.hasError) {
      this.refs.errorMessage.show();
    }
    input.blur();
    if (autoFocus) {
      setTimeout(() => input.focus(), 10);
    }
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps, errors', props.errors);
    if (props.errors.length > 0) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  handleFocus = (event) => {
    this.setState({
      active: true,
      filled: true
    });
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  handleBlur = (event) => {
    this.setState({
      active: false,
      filled: this.isFilled
    });
    this.refs.errorMessage.hide();
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  };

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
    const { backgroundColour } = this.props;
    let style = { backgroundColor: backgroundColour };
    if (this.state.active) {
      return Object.assign(style, {
        borderColor: this.props.primaryColour
      });
    }
    return style;
  }
  render() {
    const {
      placeholder,
      label,
      name,
      errors,
      extraClass,
      type,
      isDisabled,
      size,
      value,
      errorPlacement
    } = this.props;
    let { filled, active, savedValue, hasError, inputId } = this.state;
    const controlId = name || `floatTextInput_${inputId}`;
    const tooltip = (
      <Tooltip className="floatTextInputTooltip" id={`tooltipQuestion_${inputId}`}>
        {errors.map((error, i) => <p key={i}>{error}</p>)}
      </Tooltip>
    );
    return (
      <div className={cx('textInputWrap', size, extraClass)}>
        <label
          className={cx('textInputLabel', {
            filled: filled && placeholder.length === 0,
            hasError: this.hasError,
            hide: filled && placeholder.length > 0
          })}
          style={this.activeColour}>
          { label || placeholder }
        </label>
        <input
          id={controlId}
          type={type}
          value={value}
          name={name}
          ref="input"
          className={cx('textInput', {
            isErrorInput: this.hasError,
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
              hide: !this.hasError
            })} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

export default FloatTextInput;
