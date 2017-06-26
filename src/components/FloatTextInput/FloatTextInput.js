import React, {
  PropTypes,
  Component
} from 'react';
import styles from './FloatTextInput.scss';
import classNames from 'classnames/bind';
import { IoAndroidAlert } from 'react-icons/lib/io';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

class FloatTextInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    id: PropTypes.string,
    onChange: PropTypes.func,
    primaryColour: PropTypes.string,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    className: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      savedValue: typeof props.value !== 'undefined' ? props.value : '',
      focused: false,
      active: false
    };
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
        focused: true
      });
    }
    this.setState({
      active: true
    });
  }
  handleBlur = (event) => {
    if (this.state.savedValue.length === 0) {
      this.setState({
        focused: false
      });
    }
    this.setState({
      active: false
    });
  }
  get colour() {
    const { focused, active} = this.state;
    if (active) {
      return this.props.primaryColour;
    }
  }
  render() {
    const { placeholder, id, error, errorMessage } = this.props;
    let { focused, active, savedValue } = this.state;
    const cx = classNames.bind(styles);
    let tooltip = (<Tooltip id="tooltip" bsClass={cx('tooltip')}>{errorMessage}</Tooltip>);
    return (
      <div className={cx('textInputWrap', this.props.className)}>
        <label
          htmlFor={id}
          className={cx('textInputLabel', {focused: focused, error: error})}
          style={{ color: this.colour }}>
          {placeholder}
        </label>
        <input
          id={id}
          type="text"
          value={savedValue}
          className={cx('textInput', {
            error: error,
            filled: active || savedValue.length > 0
          })}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          style={{ borderColor: this.colour }}
        />
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <span className={cx('errorIcon')}>
            <IoAndroidAlert className={cx({
              hide: !error
            })} />
          </span>
        </OverlayTrigger>
      </div>
    );
  }
}

export default FloatTextInput;
