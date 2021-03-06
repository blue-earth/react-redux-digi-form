import React, {
  Component,
  PropTypes
} from 'react';
import FloatTextInput from '../../QuestionInputs/FloatTextInput';
import {
  valueIsValid
} from 'helpers/validationHelper';
import {
  aggregateVerifications
} from 'helpers/verificationHelpers';

class SingularTextInputQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,
    isInputLocked: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'text',
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

  onChange = (value) => {
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

  verify(cb) {
    const {
      value,
      compiledQuestion: { verifications }
    } = this.props;
    var self = this;
    if (verifications && verifications.length) {
      var verificationPromises = aggregateVerifications(verifications, value);
      Promise.all(verificationPromises)
        .then(function (results) {
          // todo: verifications format is [boolean...]
          // check they are all verified
          cb(true);
        }, function (errors) {
          cb(false);
          self.setState({
            'errors': errors
          });
        });
    } else {
      cb(true);
    }
  }

  render() {
    return (
      <div style={{'overflow': 'hidden', 'width': '100%'}}>
        <FloatTextInput
          onEnterKey={this.props.handleEnter}
          onChange={this.onChange}
          type={this.props.type}
          errors={this.state.errors}
          value={this.props.value}
          isDisabled={this.props.isInputLocked}
        />
      </div>
    );
  }
}

export default SingularTextInputQuestion;
