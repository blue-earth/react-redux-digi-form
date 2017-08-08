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
    primaryColour: React.PropTypes.string
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
    value: '',
    isDisabled: false,
    isReadOnly: false,
    onChange: () => {},
    onFocus: () => {},
    onEnterKey: () => {},
    onBlur: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      number: props.value || ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value;
  }

  componentDidMount() {
    const { autoFocus, isDisabled, isReadOnly, value, onFocus, onBlur } = this.props;
    // finds the input dom node to bind event handler.
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
    input.addEventListener('focus', (event) => onFocus(event));
    input.addEventListener('blur', (event) => onBlur(event));
    input.style = 'color:' + this.context.primaryColour;
    if (autoFocus) {
      setTimeout(() => input.focus(), 1);
    }
  }

  handleChange = (isValid, newValue, countryData, newNumber) => {
    const { onChange } = this.props;
    if (newValue === '') {
      return onChange('');
    }
    onChange(newNumber);
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13) {
      onEnterKey();
    }
  }

  render() {
    return (
      <IntlTelInput preferredCountries={[]}
        onlyCountries={['au', 'sg']}
        ref="intlTelInput"
        defaultCountry={'au'}
        css={['intl-tel-input phoneNumberInputWrapper', 'phoneNumberInput']}
        value={this.state.number}
        onPhoneNumberChange={this.handleChange}
        utilsScript={'libphonenumber.js'}
        />
    );
  }
}

export default PhoneNumberInput;
