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
    value: {fname: '', lname: ''}
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {fname: [], lname: []},
      isDisabled: false
    };
  }

  resetError = () => {
    this.setState({'errors': {fname: [], lname: []}});
  }

  onChange = () => {
    var id = this.props.compiledQuestion.id;
    this.resetError();
    var newValue = {
      fname: this.refs.fname.refs.input.value,
      lname: this.refs.lname.refs.input.value
    };
    if (this.props.compiledQuestion.includeMiddleName) {
      newValue.mname = this.refs.mname.refs.input.value;
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
    errors.fname = valueIsValid(value.fname, validations);
    errors.lname = valueIsValid(value.lname, validations);
    if (errors.fname.length > 0 || errors.lname.length > 0) {
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
            onEnterKey={function () { that.onEnterKeyDown(includeMiddleName ? 'mname' : 'lname'); }}
            value={this.props.value.fname}
            errors={this.state.errors.fname}
            name="fname"
            ref="fname"
          />
        </Col>
        {includeMiddleName &&
          <Col md={4} sm={12}>
            <FloatTextInput
              label="Middle name"
              onChange={this.onChange}
              onEnterKey={function () { that.onEnterKeyDown('lname'); }}
              value={this.props.value.mname}
              name="mname"
              ref="mname"
            />
          </Col>
        }
        <Col md={4} sm={12}>
          <FloatTextInput
            label="Last name"
            onChange={this.onChange}
            onEnterKey={this.onEnterKeyDown}
            value={this.props.value.lname}
            errors={this.state.errors.lname}
            name="lname"
            ref="lname"
          />
        </Col>
      </Row>
    );
  }
}

export default NameQuestion;
