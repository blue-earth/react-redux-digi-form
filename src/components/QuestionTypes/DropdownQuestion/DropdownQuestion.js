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
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: ''
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

  onEnterKeyDown = () => {
    const {
      value,
      compiledQuestion: { validations }
    } = this.props;
    var errors = valueIsValid(value, validations);
    if (errors.length > 0) {
      this.setState({
        'errors': errors
      });
      return;
    }
    this.props.handleEnter();
  }

  render() {
    const { value, compiledQuestion: { choices } } = this.props;
    return (
      <Dropdown
        value={value}
        placeholder={this.props.compiledQuestion.placeholder}
        errors={this.state.errors}
        choices={choices}
        onChange={this.handleChange}
        onEnterKey={this.onEnterKeyDown}
      />
    );
  }
}

export default DropdownQuestion;
