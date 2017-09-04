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

const cx = classNames.bind(styles);

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
    errors: PropTypes.array
  };

  static defaultProps = {
    value: '',
    isDisabled: false,
    isReadOnly: false,
    errors: [],
    onChange: () => {},
    onFocus: () => {},
    onEnterKey: () => {},
    onBlur: () => {}
  };

  componentDidMount() {
    const { value, errors, autoFocus, isDisabled, isReadOnly, onFocus, onBlur } = this.props;
    // finds the input dom node to bind event handler.
    var intlTelInput = this.refs.intlTelInput;
    var input = findDOMNode(intlTelInput.refs.telInput);
    const that = this;
    if (errors.length > 0) {
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
    input.blur();
    if (autoFocus) {
      setTimeout(() => input.focus(), 1);
    }
  }

  componentWillReceiveProps(props) {
    if (props.errors.length > 0) {
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

  get activeColour() {
    return {
      color: this.context.primaryColour,
      borderColor: this.context.primaryColour
    };
  }

  render() {
    const { value, errors } = this.props;
    const tooltip = (
      <Tooltip className="phoneInputTooltip" id="tooltipQuestion_phone">
        {errors.map((error, i) => <p key={i}>{error}</p>)}
      </Tooltip>
    );
    return (
      <div className={cx('phoneInputWrap', { phoneInputError: errors.length > 0 })} style={this.activeColour}>
        <IntlTelInput preferredCountries={[]}
          onlyCountries={['au', 'sg']}
          ref="intlTelInput"
          defaultCountry={'au'}
          css={['intl-tel-input phoneNumberInputWrapper', 'phoneNumberInput']}
          value={value}
          onPhoneNumberChange={this.handleChange}
          utilsScript={'libphonenumber.js'}
          />
        <OverlayTrigger ref="errorMessage" placement="bottom" overlay={tooltip} trigger={['hover', 'focus']}>
          <div className={cx('errorIconWrapper')}>
            <IoAndroidAlert className={cx({
              hide: errors.length === 0
            })} />
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}

export default PhoneNumberInput;
