import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { IoAndroidAlert } from 'react-icons/lib/io';
import styles from './LongTextInput.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class LongTextInput extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static defaultContext = {
    primaryColour: '#333333'
  }

  static propTypes = {
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    errors: PropTypes.array,
    isDisabled: PropTypes.bool,
    rows: React.PropTypes.number,
    cols: React.PropTypes.number,
    onEnterKey: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    primaryColour: PropTypes.string,
    backgroundColour: PropTypes.string
  };

  static defaultProps = {
    placeholder: '',
    rows: 6,
    cols: 50,
    errors: []
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
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
    this.setState({
      savedValue: props.value
    });
    if (props.errors.length > 0) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
  }

  get hasError() {
    return this.props.errors.length > 0;
  }

  handleChange = (event) => {
    const value = event.target.value;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  };

  handleFocus = (event) => {
    this.setState({
      active: true
    });
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    this.setState({
      active: false
    });
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
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
      errors,
      isDisabled,
      value,
      autoFocus
    } = this.props;
    let { active } = this.state;

    const tooltip = (
      <Tooltip className="inputTooltip" id="tooltip">
        {errors.map((error, i) => <p key={i}>{error}</p>)}
      </Tooltip>
    );

    return (
      <div className={cx('textInputWrap')}>
        <textarea
          placeholder={this.props.placeholder}
          className={cx('textInput', {
            isErrorInput: this.hasError,
            filledInput: active,
            disabled: isDisabled
          })}
          rows={this.props.rows}
          cols={this.props.cols}
          value={value}
          ref="input"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          autoFocus={autoFocus}
          disabled={isDisabled}
        />
        <OverlayTrigger ref="errorMessage" placement="right" overlay={tooltip} trigger={['hover', 'focus']}>
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

export default LongTextInput;
