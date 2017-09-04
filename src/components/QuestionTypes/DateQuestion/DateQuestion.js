import React, {
  Component,
  PropTypes
} from 'react';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import {
  valueIsValid
} from 'helpers/validationHelper';
import {
  aggregateVerifications
} from 'helpers/verificationHelpers';

class DateQuestion extends Component {

  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.object,
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: null
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      isDisabled: false
    };
  }

  resetError = () => {
    this.setState({'errors': []});
  }

  handleChange = (value) => {
    this.resetError();
    this.props.onChange(value);
  };

  onEnterKeyDown = () => {
    var self = this;
    const {
      value,
      compiledQuestion,
      compiledQuestion: { validations, verifications }
    } = this.props;
    var errors = valueIsValid(value, validations);
    if (errors.length > 0) {
      this.setState({
        'errors': errors
      });
      return;
    }

    if (compiledQuestion.verifications && compiledQuestion.verifications.length) {
      // Check Verifications
      this.setState({
        'isDisabled': true
      });
      var verificationPromises = aggregateVerifications(verifications, value);
      Promise.all(verificationPromises)
        .then(function (verifications) {
          // todo: verifications format is [boolean...]
          // check they are all verified
          self.props.handleEnter();
        }, function (errors) {
          self.setState({
            'errors': errors,
            'isDisabled': false
          });
        });
    } else {
      self.props.handleEnter();
    }
  };

  render() {
    return (
      <DateInput
        onEnterKey={this.onEnterKeyDown}
        onChange={this.handleChange}
        errors={this.state.errors}
        value={this.props.value}
        dateFormat={this.props.compiledQuestion.dateFormat}
        isDisabled={this.state.isDisabled}
      />
    );
  }
}

export default DateQuestion;
