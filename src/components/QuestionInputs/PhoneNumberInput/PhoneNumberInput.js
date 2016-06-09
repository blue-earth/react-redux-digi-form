import React, { Component, PropTypes } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import { findDOMNode } from 'react-dom';
import '../../../../node_modules/react-intl-tel-input/dist/libphonenumber.js';
import '../../../../node_modules/react-intl-tel-input/dist/main.css';
import styles from './PhoneNumberInput.scss';

class PhoneNumberInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    autoFocus: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKey: PropTypes.func,
  };

  static defaultProps = {
    placeholderText: '',
    value: ''
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps.value, this.props.value)
    return nextProps.value != this.props.value;
  }

  componentDidMount() {
    // finds the input dom node to bind event handler.
    const { autoFocus } = this.props;
    var telInput = findDOMNode(this.refs.intlTelInput.refs.telInput);
    const that = this;
    telInput.addEventListener('keydown', (event) => that.handleKeydown(event));
    telInput.addEventListener('focus', (event) => that.handleFocus(event));
    telInput.addEventListener('blur', (event) => that.handleBlur(event));
    telInput.style = 'color:' + this.context.primaryColor;
    if ( autoFocus ) setTimeout(() => telInput.focus(), 1);
  }

  changeHandler = (isValid, newValue, countryData, newNumber) => {
    const { onChange, value } = this.props;
    console.log(isValid, newValue, countryData, newNumber);
    if (newNumber == '') newNumber = '+' + countryData.dialCode;
    if (value !== newNumber && typeof onChange === 'function') {
      console.log(newNumber);
      onChange(newNumber);
    }
  }

  handleKeydown = (event) => {
    const { onEnterKey } = this.props;
    if (typeof onEnterKey === 'function' && event.keyCode == 13)
      onEnterKey();
  }

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function')
      onFocus(event.target.value);
  }

  handleBlur = (event) => {
    if (typeof this.refs.intlTelInput !== 'undefined') {
      var flagDropDown = findDOMNode(this.refs.intlTelInput.refs.flagDropDown);
      var selectedFlag = flagDropDown.querySelector('.selected-flag');
      // clicking on dropdown shouldn't fire blur
      if (event.relatedTarget == selectedFlag) return;
    }
    const { onBlur } = this.props;
    if (typeof onBlur === 'function')
      onBlur(event.target.value);
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
    )
  }
}

export default PhoneNumberInput;
