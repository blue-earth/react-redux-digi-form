import React, {
  Component,
  PropTypes
} from 'react';
import styles from './TextInput.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class TextInput extends Component {

  static propTypes = {
    placeholderText: PropTypes.string,
    label: PropTypes.any,
    wrapperClass: PropTypes.string,
    /*
    / labelStyle
    / major - roble_alt_boldbold, 16px
    / minor - Open Sans, 13px
    */
    labelStyle: PropTypes.oneOf(['major', 'minor']),
    prefix: PropTypes.string,
    helpText: PropTypes.string,
    fullWidth: PropTypes.bool,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    isReadOnly: PropTypes.bool,
    isDisabled: PropTypes.bool,
    // redux-form will supply an array of error messages
    hasError: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    /*
    / If this component receives an onChange prop it will be
    / a controlled component. The value of the input will be
    / passed to the onChange function.
    / If there is no onChange, then it will be considered an
    / uncontrolled component, and the value will be added as
    / a defaultValue.
    */
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    placeholderText: '',
    labelStyle: 'major',
    fullWidth: true,
    value: '',
    type: 'text',
    isDisabled: false,
    isReadOnly: false,
    hasError: false
  };

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13 && typeof onEnterKey === 'function') {
      onEnterKey();
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  getInputCSSClass() {
    const {isReadOnly, isDisabled, hasError, fullWidth} = this.props;
    return cx('textInput', {
      'isReadOnly': isReadOnly,
      'isDisabled': isDisabled,
      'hasError': hasError,
      'fullWidth': fullWidth
    });
  }

  getWrapperCSSClass() {
    const { prefix, wrapperClass } = this.props;
    return cx('textInputWrapper', {
      'hasPrefix': prefix,
      [wrapperClass]: wrapperClass
    });
  }

  renderLabel() {
    const { label, labelStyle } = this.props;
    if (typeof label !== 'undefined') {
      return (<label className={cx(labelStyle)}>{label}</label>);
    } else {
      return false;
    }
  }

  renderPrefix() {
    const { prefix } = this.props;
    if (typeof prefix !== 'undefined') {
      return (<span className={cx('prefix')}>{prefix}</span>);
    } else {
      return false;
    }
  }

  renderHelpText() {
    const { helpText } = this.props;
    if (typeof helpText !== 'undefined') {
      return (<span className={cx('help')}>{helpText}</span>);
    } else {
      return false;
    }
  }

  render() {
    const {
      type,
      autoFocus,
      placeholderText,
      value,
      isDisabled,
      isReadOnly } = this.props;
    var optionals = {};
    if (placeholderText) {
      optionals['placeholder'] = placeholderText;
    }
    if (isDisabled) {
      optionals['disabled'] = 'disabled';
    }
    if (isReadOnly) {
      optionals['readOnly'] = true;
    }
    var valueProp = {};
    if (typeof this.props.onChange === 'function') {
      // component is controlled
      valueProp['value'] = value;
    } else {
      // component is uncontrolled
      valueProp['defaultValue'] = value;
    }

    return (
      <div className={this.getWrapperCSSClass()}>
        {this.renderLabel()}
        {this.renderPrefix()}
        <div className={cx('overflowWrapper')}>
          <input
            {...valueProp}
            className={this.getInputCSSClass()}
            type={type}
            autoFocus={autoFocus}
            onChange={this.handleChange}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            onKeyDown={this.handleKeyDown}
            {...optionals}
          />
        </div>
        {this.renderHelpText()}
      </div>
    );
  }
}

export default TextInput;
