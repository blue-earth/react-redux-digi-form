import React, {
  Component,
  PropTypes
} from 'react';
import IntlTelInput from 'react-intl-tel-input';
import { findDOMNode } from 'react-dom';
import '../../../../node_modules/react-intl-tel-input/dist/libphonenumber.js';
import '../../../../node_modules/react-intl-tel-input/dist/main.css';
import './PhoneNumberInput.scss';
import _ from 'lodash';

class PhoneNumberInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    placeholderText: '',
    value: '',
    isDisabled: false,
    isReadOnly: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  }

  componentDidMount() {
    // finds the input dom node to bind event handler.
    const { autoFocus, isDisabled, isReadOnly, value } = this.props;
    var intlTelInput = this.refs.intlTelInput;
    var input = findDOMNode(intlTelInput.refs.telInput);
    const that = this;

    if (isDisabled) {
      intlTelInput.setState({
        telInput: _.merge(intlTelInput.state.telInput, {
          isDisabled: true,
          value: value
        })
      });
    }
    if (isReadOnly) {
      intlTelInput.setState({
        telInput: _.merge(intlTelInput.state.telInput, {
          readonly: true,
          value: value
        })
      });
    }

    input.addEventListener('keydown', (event) => that.handleKeyDown(event));
    input.addEventListener('focus', (event) => that.handleFocus(event));
    input.addEventListener('blur', (event) => that.handleBlur(event));
    input.style = 'color:' + this.context.primaryColor;
    if (autoFocus) setTimeout(() => input.focus(), 1);
  }

  changeHandler = (isValid, newValue, countryData, newNumber) => {
    const { onChange, value } = this.props;
    if (newNumber === '') newNumber = '+' + countryData.dialCode;
    if (value !== newNumber && typeof onChange === 'function') {
      onChange(newNumber);
    }
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (typeof onEnterKey === 'function' && event.keyCode === 13) {
      onEnterKey();
    }
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') {
      onFocus();
    }
  }

  handleBlur = (event) => {
    if (typeof onBlur === 'function') {
      if (typeof this.refs.intlTelInput !== 'undefined') {
        var flagDropDown = findDOMNode(this.refs.intlTelInput.refs.flagDropDown);
        var selectedFlag = flagDropDown.querySelector('.selected-flag');
        // clicking on dropdown shouldn't fire blur
        if (event.relatedTarget === selectedFlag) return;
      }
      const { onBlur } = this.props;
      onBlur();
    }
  }

  render() {
    const { value } = this.props;

    return (
      <IntlTelInput preferredCountries={[]}
        onlyCountries={['au', 'sg']}
        ref="intlTelInput"
        defaultCountry={'au'}
        css={['intl-tel-input phoneNumberInputWrapper', 'phoneNumberInput']}
        nationalMode={false}
        value={value}
        onPhoneNumberChange={this.changeHandler}
        utilsScript={'libphonenumber.js'}
        />
    );
  }
}

export default PhoneNumberInput;
