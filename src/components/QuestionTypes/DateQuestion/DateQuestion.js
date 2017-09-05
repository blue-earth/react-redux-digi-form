import React, {
  Component,
  PropTypes
} from 'react';
import DateInput from '../../QuestionInputs/DateInput/DateInput';
import {
  valueIsValid
} from 'helpers/validationHelper';

class DateQuestion extends Component {

  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.object,
    isInputLocked: PropTypes.bool,
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: null,
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

  render() {
    return (
      <DateInput
        onEnterKey={this.props.handleEnter}
        onChange={this.handleChange}
        errors={this.state.errors}
        value={this.props.value}
        dateFormat={this.props.compiledQuestion.dateFormat}
        isDisabled={this.props.isInputLocked}
      />
    );
  }
}

export default DateQuestion;
