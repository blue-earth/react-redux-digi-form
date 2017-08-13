import React, {
  Component,
  PropTypes
} from 'react';
import styles from './TextInput.scss';
import classNames from 'classnames';

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
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array
    ]),
    isReadOnly: PropTypes.bool,
    isDisabled: PropTypes.bool,
    // redux-form will supply an array of error messages
    hasError: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
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
      // this.refs.input.blur()
    }
  }

  getInputCSSClass() {
    const {isReadOnly, isDisabled, hasError, fullWidth} = this.props;
    return classNames({
      [styles.isReadOnly]: isReadOnly,
      [styles.isDisabled]: isDisabled,
      [styles.hasError]: hasError,
      [styles.fullWidth]: fullWidth,
      [styles.textInput]: true
    });
  }

  getWrapperCSSClass() {
    const { prefix, wrapperClass } = this.props;
    return classNames({
      [styles.hasPrefix]: prefix,
      [styles.formGroup]: true,
      [wrapperClass]: wrapperClass
    });
  }

  renderLabel() {
    const { label, labelStyle } = this.props;
    if (typeof label !== 'undefined') {
      return (<label className={styles[labelStyle]}>{label}</label>);
    } else {
      return false;
    }
  }

  renderPrefix() {
    const { prefix } = this.props;
    if (typeof prefix !== 'undefined') {
      return (<span className={styles.prefix}>{prefix}</span>);
    } else {
      return false;
    }
  }

  renderHelpText() {
    const { helpText } = this.props;
    if (typeof helpText !== 'undefined') {
      return (<span className={styles.help}>{helpText}</span>);
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
      defaultValue,
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
    if (value || !defaultValue) {
      valueProp['value'] = value;
    } else if (defaultValue) {
      valueProp['defaultValue'] = defaultValue;
    }

    return (
      <div className={this.getWrapperCSSClass()}>
        {this.renderLabel()}
        {this.renderPrefix()}
        <div className={styles.inputWrapper}>
          <input
            {...valueProp}
            className={this.getInputCSSClass()}
            type={type}
            autoFocus={autoFocus}
            onChange={this.props.onChange}
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
