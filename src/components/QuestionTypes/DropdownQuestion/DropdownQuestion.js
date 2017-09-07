import React, {
  Component,
  PropTypes
} from 'react';
import Dropdown from '../../QuestionInputs/Dropdown';
import {
  valueIsValid
} from 'helpers/validationHelper';

class DropdownQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

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

  handleChange = (value) => {
    this.setState({'errors': []});
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
    const { value, compiledQuestion: { choices } } = this.props;
    return (
      <Dropdown
        value={value}
        placeholder={this.props.compiledQuestion.placeholder}
        errors={this.state.errors}
        choices={choices}
        onChange={this.handleChange}
        onEnterKey={this.props.handleEnter}
        isDisabled={this.props.isInputLocked}
      />
    );
  }
}

export default DropdownQuestion;
