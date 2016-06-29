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
    autoComplete: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onEnterKey: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
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
    autoComplete: true,
    onChange: () => {},
    onEnterKey: () => {},
    onFocus: () => {},
    onBlur: () => {}
  };

  componentDidMount() {
    const { autoComplete } = this.props;
    if (autoComplete) {
      this.initAutocomplete();
    }
  }

  componentWillUnmount() {
    const { autocomplete } = this.state;
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
      document.querySelector('body').removeChild(document.querySelector('.pac-container'));
    }
  }

  initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */this.refs.addressLine1Input,
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', this.fillInAddress);
    this.setState({ autocomplete });
  }

  fillInAddress = () => {
    const componentForm = {
      street_number: {
        fieldName: 'short_name',
        ref: 'addressLine1Input',
        for: 'address_line1'
      },
      route: {
        fieldName: 'long_name',
        ref: 'addressLine2Input',
        for: 'address_line2'
      },
      locality: {
        fieldName: 'long_name',
        ref: 'suburbInput',
        for: 'suburb'
      },
      administrative_area_level_1: {
        fieldName: 'long_name',
        ref: 'stateInput',
        for: 'state'
      },
      /*
      country: {
        fieldName: 'long_name',
        ref: ''
      },*/
      postal_code: {
        fieldName: 'short_name',
        ref: 'postcodeInput',
        for: 'postcode'
      }
    };
    const { autocomplete } = this.state;
    var place = autocomplete.getPlace();

    var newValue = {};
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType].fieldName];
        newValue[componentForm[addressType].for] = val;
      }
    }
    // adjust field values
    if (newValue['address_line2']) {
      if (newValue['address_line1']) {
        newValue['address_line1'] += ' ' + newValue['address_line2'];
      } else {
        newValue['address_line1'] = newValue['address_line2'];
      }
      newValue['address_line2'] = '';
    }

    for (var prop in componentForm) {
      var component = componentForm[prop];
      this.refs[component.ref].value = newValue[component.for] ? newValue[component.for] : '';
    }

    this.handleChange();
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  geolocate() {
    const { autocomplete } = this.state;

    if (navigator.geolocation && autocomplete) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  handleFocusAddressLine1 = (event) => {
    const { onFocus } = this.props;
    this.geolocate();
    onFocus();
  }

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
      };
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
    const { isDisabled, isReadOnly, autoFocus, onFocus, onBlur } = this.props;
    const { primaryColor } = this.context;
    const { suburb, state, postcode } = this.state;
    var optionals = {};

    if (isDisabled) {
      optionals['disabled'] = 'disabled';
    }

    if (isReadOnly) {
      optionals['readOnly'] = true;
    }

    if (typeof primaryColor !== 'undefined') {
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
              onFocus={this.handleFocusAddressLine1}
              onBlur={onBlur}
              autoFocus={autoFocus}
              placeholder="Address Line 1"
              value={this.state.address_line1}
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
              value={this.state.address_line2}
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
