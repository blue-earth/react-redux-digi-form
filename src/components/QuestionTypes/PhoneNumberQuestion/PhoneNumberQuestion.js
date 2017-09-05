import React, {
  Component,
  PropTypes
} from 'react';
import PhoneNumberInput from '../../QuestionInputs/PhoneNumberInput/PhoneNumberInput';
import {
  valueIsValid
} from 'helpers/validationHelper';
import {
  aggregateVerifications
} from 'helpers/verificationHelpers';

class PhoneNumberQuestion extends Component {

  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.string,
    isInputLocked: PropTypes.bool,
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: '',
    isInputLocked: false
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };
  }

  resetError = () => {
    this.setState({'errors': []});
  }

  handleChange = (value) => {
    this.resetError();
    this.props.onChange(value);
  };

  validate(cb) {
    const {
      value,
      compiledQuestion: { validations }
    } = this.props;
    var errors = valueIsValid(value, validations);
    if (errors.length > 0) {
      this.setState({
        'errors': errors
      });
      return cb(false);
    } else {
      return cb(true);
    }
  }

  // no verifications currently required for this question type

  render() {
    return (
      <PhoneNumberInput
        onEnterKey={this.props.handleEnter}
        onChange={this.handleChange}
        errors={this.state.errors}
        value={this.props.value}
        isDisabled={this.props.isInputLocked}
      />
    );
  }
}

export default PhoneNumberQuestion;
