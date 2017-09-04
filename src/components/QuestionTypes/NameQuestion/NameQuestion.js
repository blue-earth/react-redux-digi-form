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
    storeAnswer: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,
    changeCurrentState: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: {first_name: '', last_name: ''}
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {first_name: [], last_name: []},
      isDisabled: false
    };
  }

  resetError = () => {
    this.setState({'errors': {first_name: [], last_name: []}});
  }

  onChange = () => {
    var id = this.props.compiledQuestion.id;
    this.resetError();
    var newValue = {
      first_name: this.refs.first_name.refs.input.value,
      last_name: this.refs.last_name.refs.input.value
    };
    if (this.props.compiledQuestion.includeMiddleName) {
      newValue.middle_name = this.refs.middle_name.refs.input.value;
    }
    this.props.changeCurrentState({
      answerValue: newValue,
      inputState: 'changed'
    });
    this.props.storeAnswer({
      id,
      newValue
    });
  };

  onEnterKeyDown = (nextRef=false) => {
    var self = this;
    if (nextRef) {
      this.refs[nextRef].refs.input.focus();
      return;
    }
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
      return;
    }
    // no verifications for name field
    self.props.handleEnter();
  };

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
            name="last_name"
            ref="last_name"
          />
        </Col>
      </Row>
    );
  }
}

export default NameQuestion;
