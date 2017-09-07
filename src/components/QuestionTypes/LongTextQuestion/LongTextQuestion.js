import React, {
  Component,
  PropTypes
} from 'react';
import LongTextInput from '../../QuestionInputs/LongTextInput';
import {
  valueIsValid
} from 'helpers/validationHelper';

class LongTextQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.string,
    isInputLocked: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
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
      <div style={{'overflow': 'hidden', 'width': '100%'}}>
        <LongTextInput
          onChange={this.handleChange}
          errors={this.state.errors}
          value={this.props.value}
          placeholder={this.props.compiledQuestion.placeholder}
          isDisabled={this.props.isInputLocked}
        />
      </div>
    );
  }
}

export default LongTextQuestion;
