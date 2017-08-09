import React, {
  Component,
  PropTypes
} from 'react';
import IntlTelInput from 'react-intl-tel-input';
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import '../../../../node_modules/react-intl-tel-input/dist/libphonenumber.js';
import '../../../../node_modules/react-intl-tel-input/dist/main.css';
import styles from './PhoneNumberInput.scss';
import classNames from 'classnames/bind';
import { IoAndroidAlert } from 'react-icons/lib/io';
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
    onEnterKey: PropTypes.func,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.element
  };

  static defaultProps = {
    value: '',
    isDisabled: false,
    isReadOnly: false,
    hasError: false,
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.value !== this.props.value;
  // }

  componentDidMount() {
    const { autoFocus, isDisabled, isReadOnly, hasError, value, onFocus, onBlur } = this.props;
    // finds the input dom node to bind event handler.
    var intlTelInput = this.refs.intlTelInput;
    var input = findDOMNode(intlTelInput.refs.telInput);
    const that = this;
    if (hasError) {
      this.refs.errorMessage.show();
    }
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
    input.blur();
    if (autoFocus) {
      setTimeout(() => input.focus(), 1);
    }
  }

  componentWillReceiveProps(props) {
    if (props.hasError) {
      this.refs.errorMessage.show();
    } else {
      this.refs.errorMessage.hide();
    }
  }

  handleChange = (isValid, newValue, countryData, newNumber) => {
    const { onChange } = this.props;
    if (newValue === '') {
      return onChange('');
    }
    onChange(newNumber);
  }

  handleBlur = (event) => {
    this.refs.errorMessage.hide();
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13) {
      onEnterKey();
    }
  }

  render() {
    const { errorMessage, hasError } = this.props;
    const cx = classNames.bind(styles); // eslint-disable-line
    const tooltip = (
      <Tooltip className="phoneInputTooltip" id="tooltipQuestion_phone">
        {errorMessage}
      </Tooltip>
    );
    return (
      <div className={cx('phoneInputWrap', { phoneInputError: hasError })}>
        <IntlTelInput preferredCountries={[]}
          onlyCountries={['au', 'sg']}
          ref="intlTelInput"
          defaultCountry={'au'}
          css={['intl-tel-input phoneNumberInputWrapper', 'phoneNumberInput']}
          value={this.state.number}
          onPhoneNumberChange={this.handleChange}
          utilsScript={'libphonenumber.js'}
          />
        <OverlayTrigger ref="errorMessage" placement="bottom" overlay={tooltip} trigger={['hover', 'focus']}>
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

export default PhoneNumberInput;
