import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import { loadScript } from 'helpers/pureFunctions';
import FloatTextInput from '../../QuestionInputs/FloatTextInput';
import {
  valueIsValid
} from 'helpers/validationHelper';

class AddressQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.object,
    isInputLocked: PropTypes.bool,
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    isInputLocked: false,
    value: {
      unit_number: '',
      address_line1: '',
      suburb: '',
      state: '',
      postcode: ''
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {
        address_line1: [],
        suburb: [],
        state: [],
        postcode: []
      }
    };
  }

  componentDidMount() {
    // const { autoComplete } = this.props.compiledQuestion;
    var autoComplete = true;
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
        /** @type {!HTMLInputElement} */this.refs.address_line1.refs.input,
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
        ref: 'unit_number',
        for: 'unit_number'
      },
      street_number: {
        fieldName: 'short_name',
        ref: 'address_line1',
        for: 'address_line1'
      },
      route: {
        fieldName: 'long_name',
        ref: 'address_line2',
        for: 'address_line2'
      },
      locality: {
        fieldName: 'long_name',
        ref: 'suburb',
        for: 'suburb'
      },
      administrative_area_level_1: {
        fieldName: 'long_name',
        ref: 'state',
        for: 'state'
      },
      postal_code: {
        fieldName: 'short_name',
        ref: 'postcode',
        for: 'postcode'
      }
    };
    const { autocomplete } = this.state;
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      return;
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
    this.resetError();
    this.props.onChange(newValue);
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

  resetError = () => {
    this.setState({'errors': {first_name: [], last_name: []}});
  }

  handleFocusAddressLine1 = (event) => {
    this.geolocate();
  }

  handleChange = () => {
    this.resetError();
    var newValue = {
      unit_number: this.refs.unit_number.refs.input.value,
      address_line1: this.refs.address_line1.refs.input.value,
      suburb: this.refs.suburb.refs.input.value,
      state: this.refs.state.refs.input.value,
      postcode: this.refs.postcode.refs.input.value
    };
    this.props.onChange(newValue);
  };

  onEnterKeyDown = (nextRef=false) => {
    if (nextRef) {
      this.refs[nextRef].refs.input.focus();
      return;
    }
    this.props.handleEnter();
  };

  validate(cb) {
    const {
      value,
      compiledQuestion: { validations }
    } = this.props;
    var errors = this.state.errors;
    errors.address_line1 = valueIsValid(value.address_line1, validations);
    errors.suburb = valueIsValid(value.suburb, validations);
    errors.state = valueIsValid(value.state, validations);
    errors.postcode = valueIsValid(value.postcode, validations);
    var hasErrors = false;
    for (var key in errors) {
      if (errors[key].length > 0) {
        this.setState({ 'errors': errors });
        hasErrors = true;
        break;
      }
    }
    if (hasErrors) {
      return cb(false);
    } else {
      return cb(true);
    }
  }

  // no verifications currently required for this question type

  render() {
    const { value } = this.props;
    const { primaryColour } = this.context;
    const that = this;
    return (
      <div>
        <Row>
          <Col md={4} sm={6}>
            <FloatTextInput
              label="Unit number"
              value={value.unit_number}
              errors={this.state.errors.unit_number}
              isDisabled={this.props.isInputLocked}
              onChange={this.handleChange}
              onEnterKey={function () { that.onEnterKeyDown('address_line1'); }}
              name="unit_number"
              ref="unit_number"
              primaryColour={primaryColour}
            />
          </Col>
          <Col md={8} sm={12}>
            <FloatTextInput
              label="Address Line 1"
              value={value.address_line1}
              errors={this.state.errors.address_line1}
              isDisabled={this.props.isInputLocked}
              autoFocus={value.address_line1.length === 0}
              onChange={this.handleChange}
              onFocus={this.handleFocusAddressLine1}
              onEnterKey={function () { that.onEnterKeyDown('suburb'); }}
              name="address_line1"
              ref="address_line1"
              primaryColour={primaryColour}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FloatTextInput
              label="City"
              value={value.suburb}
              errors={this.state.errors.suburb}
              isDisabled={this.props.isInputLocked}
              onChange={this.handleChange}
              onEnterKey={function () { that.onEnterKeyDown('state'); }}
              name="suburb"
              ref="suburb"
              primaryColour={primaryColour}
            />
          </Col>
          <Col sm={6}>
            <FloatTextInput
              label="State"
              value={value.state}
              errors={this.state.errors.state}
              isDisabled={this.props.isInputLocked}
              onChange={this.handleChange}
              onEnterKey={function () { that.onEnterKeyDown('postcode'); }}
              name="state"
              ref="state"
              primaryColour={primaryColour}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={6}>
            <FloatTextInput
              label="Postal Code"
              value={value.postcode}
              errors={this.state.errors.postcode}
              isDisabled={this.props.isInputLocked}
              onChange={this.handleChange}
              onEnterKey={function () { that.onEnterKeyDown(); }}
              name="postcode"
              ref="postcode"
              primaryColour={primaryColour}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddressQuestion;
