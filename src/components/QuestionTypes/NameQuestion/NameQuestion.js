import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import FloatTextInput from '../../QuestionInputs/FloatTextInput';
import {
  valueIsValid
} from 'helpers/validationHelper';

class NameQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.object,
    isInputLocked: PropTypes.bool,
    handleEnter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: {first_name: '', last_name: ''},
    isInputLocked: false
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {first_name: [], last_name: []}
    };
  }

  resetError = () => {
    this.setState({'errors': {first_name: [], last_name: []}});
  }

  onChange = () => {
    this.resetError();
    var newValue = {
      first_name: this.refs.first_name.refs.input.value,
      last_name: this.refs.last_name.refs.input.value
    };
    if (this.props.compiledQuestion.includeMiddleName) {
      newValue.middle_name = this.refs.middle_name.refs.input.value;
    }
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
    errors.first_name = valueIsValid(value.first_name, validations);
    errors.last_name = valueIsValid(value.last_name, validations);
    if (errors.first_name.length > 0 || errors.last_name.length > 0) {
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
    const includeMiddleName = this.props.compiledQuestion.includeMiddleName;
    const that = this;
    return (
      <Row>
        <Col md={4} sm={12}>
          <FloatTextInput
            label="First name"
            onChange={this.onChange}
            onEnterKey={function () { that.onEnterKeyDown(includeMiddleName ? 'middle_name' : 'last_name'); }}
            value={this.props.value.first_name}
            errors={this.state.errors.first_name}
            isDisabled={this.props.isInputLocked}
            name="first_name"
            ref="first_name"
          />
        </Col>
        {includeMiddleName &&
          <Col md={4} sm={12}>
            <FloatTextInput
              label="Middle name"
              onChange={this.onChange}
              onEnterKey={function () { that.onEnterKeyDown('last_name'); }}
              value={this.props.value.middle_name}
              isDisabled={this.props.isInputLocked}
              name="middle_name"
              ref="middle_name"
            />
          </Col>
        }
        <Col md={4} sm={12}>
          <FloatTextInput
            label="Last name"
            onChange={this.onChange}
            onEnterKey={this.onEnterKeyDown}
            value={this.props.value.last_name}
            errors={this.state.errors.last_name}
            isDisabled={this.props.isInputLocked}
            name="last_name"
            ref="last_name"
          />
        </Col>
      </Row>
    );
  }
}

export default NameQuestion;
