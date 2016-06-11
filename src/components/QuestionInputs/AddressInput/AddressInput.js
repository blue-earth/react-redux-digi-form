import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './AddressInput.scss';

class AddressInput extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = props.value;
  }
  
  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    isDisabled: false,
    value: {
      address_line1: '',
      address_line2: '',
      suburb: '',
      state: '',
      postcode: ''
    },
    onChange: () => {},
    onEnterKey: () => {},
    onFocus: () => {},
    onBlur: () => {}
  };

  handleChangeAddressLine1 = (event) => {

  }

  handleChangeAddressLine2 = (event) => {

  }

  handleChangeSuburb = (event) => {

  }

  handleChangeState = (event) => {

  }

  handleChangePostcode = (event) => {

  }

  handleChange = (event) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      var newValue = {
        address_line1: this.refs.addressLine1Input.value,
        address_line2: this.refs.addressLine2Input.value,
        suburb: this.refs.suburbInput.value,
        state: this.refs.stateInput.value,
        postcode: this.refs.postcodeInput.value
      }
      this.setState(newValue);
      onChange(newValue);
    }
  }

  handleKeyDown = (event) => {
    const { onEnterKey } = this.props;
    if (event.keyCode === 13) {
      onEnterKey();
    }
  }

  render() {
    const { isDisabled, isReadOnly, value, autoFocus, onFocus, onBlur } = this.props;
    const { primaryColor } = this.context;
    const { address_line1, address_line2, suburb, state, postcode } = this.state;
    var optionals = {};
    
    if (isDisabled) {
      optionals['disabled'] = 'disabled';
    }

    if (isReadOnly) {
      optionals['readOnly'] = true;
    }

    if ( typeof primaryColor !== 'undefined' ) {
      optionals['style'] = {
        color: primaryColor
      };
    }

    return (
      <div className={styles.addressWrapper}>
        <Row className={styles.addressRow}>
          <Col sm={6} className={styles.addressCol}>
            <input className={`${styles.addressInput} ${styles.addressLine1}`}
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={this.handleKeyDown}
              autoFocus={autoFocus}
              placeholder="Address Line 1"
              value={address_line1}
              data-name="addressLine1Input"
              ref="addressLine1Input"
              {...optionals}
            />
          </Col>
          <Col sm={6} className={styles.addressCol}>
            <input className={`${styles.addressInput} ${styles.addressLine2}`}
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Address Line 2"
              value={address_line2}
              data-name="addressLine2Input"
              ref="addressLine2Input"
              {...optionals}
            />
          </Col>
        </Row>
        <Row className={styles.addressRow}>
          <Col sm={6} className={styles.addressCol}>
            <input className={`${styles.addressInput} ${styles.suburb}`}
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Suburb"
              value={suburb}
              data-name="suburbInput"
              ref="suburbInput"
              {...optionals}
            />
          </Col>
          <Col sm={3} className={styles.addressCol}>
            <input className={`${styles.addressInput} ${styles.state}`}
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="State"
              value={state}
              data-name="stateInput"
              ref="stateInput"
              {...optionals}
            />
          </Col>
          <Col sm={3} className={styles.addressCol}>
            <input className={`${styles.addressInput} ${styles.postcode}`}
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Postcode"
              value={postcode}
              data-name="postcodeInput"
              ref="postcodeInput"
              {...optionals}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddressInput;
