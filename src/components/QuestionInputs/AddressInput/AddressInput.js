import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import { loadScript } from 'helpers/pureFunctions';
import FloatTextInput from 'components/QuestionInputs/FloatTextInput';
import styles from './AddressInput.scss';

class AddressInput extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
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
      unit_number: '',
      address_line1: '',
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
      // check if it's already loaded by id.
      if (!document.getElementById('googlemap_script')) {
        loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`,
          'googlemap_script',
          this.initAutocomplete
        );
      } else {
        this.initAutocomplete();
      }
    }
  }

  componentWillUnmount() {
    const { autocomplete } = this.state;
    if (autocomplete) {
      google.maps.event.clearInstanceListeners(autocomplete);
      const pc = document.querySelector('.pac-container');
      pc && document.querySelector('body').removeChild(pc);
    }
  }

  initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */this.refs.addressLine1Input.refs.input,
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', this.fillInAddress);
    this.setState({ autocomplete });
  }

  fillInAddress = () => {
    const componentForm = {
      subpremise: {
        fieldName: 'short_name',
        ref: 'unitNumberInput',
        for: 'unit_number'
      },
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
      postal_code: {
        fieldName: 'short_name',
        ref: 'postcodeInput',
        for: 'postcode'
      }
    };
    const { autocomplete } = this.state;
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      return this.setState({
        address_line1: place.name
      });
    }
    let newValue = {};
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
      delete newValue['address_line2']; // remove addressline2
    }
    let newState = {};
    for (let key of Object.keys(componentForm)) {
      const component = componentForm[key];
      if (newValue[component.for] && newValue[component.for].length > 0) {
        newState[component.for] = newValue[component.for];
      }
    }
    this.setState(newState);
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

  handleChange = (event) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      var newValue = {
        address_line1: this.refs.addressLine1Input.refs.input.value,
        unit_number: this.refs.unitNumberInput.refs.input.value,
        suburb: this.refs.suburbInput.refs.input.value,
        state: this.refs.stateInput.refs.input.value,
        postcode: this.refs.postcodeInput.refs.input.value
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
    const { primaryColour } = this.context;
    const { suburb, state, postcode } = this.state;
    var optionals = {};

    if (isDisabled) {
      optionals['disabled'] = 'disabled';
    }

    if (isReadOnly) {
      optionals['readOnly'] = true;
    }

    if (typeof primaryColour !== 'undefined') {
      optionals['style'] = {
        color: primaryColour
      };
    }

    return (
      <div className={styles.addressWrapper}>
        <Row>
          <Col md={4} sm={6}>
            <FloatTextInput
              label="Unit number"
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              value={this.state.unit_number}
              name="unitNumberInput"
              primaryColour={primaryColour}
              ref="unitNumberInput"
            />
          </Col>
          <Col md={8} sm={12}>
            <FloatTextInput
              label="Address Line 1"
              autoFocus={autoFocus}
              onChange={this.handleChange}
              onFocus={this.handleFocusAddressLine1}
              onBlur={onBlur}
              value={this.state.address_line1}
              name="addressLine1Input"
              primaryColour={primaryColour}
              ref="addressLine1Input"
              refName="addressLine1Input" />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FloatTextInput
              label="City"
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              value={suburb}
              name="suburbInput"
              ref="suburbInput"
            />
          </Col>
          <Col sm={6}>
            <FloatTextInput
              label="State"
              onChange={this.handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              value={state}
              name="stateInput"
              ref="stateInput"
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={6}>
            <FloatTextInput
              label="Postal Code"
              onChange={this.handleChange}
              onBlur={onBlur}
              value={postcode}
              name="postcodeInput"
              primaryColour={primaryColour}
              ref="postcodeInput"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddressInput;
