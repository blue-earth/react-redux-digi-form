import React, {
  Component,
  PropTypes
} from 'react';
import LongTextInput from '../../QuestionInputs/LongTextInput';
import {
  valueIsValid
} from 'helpers/validationHelper';
import {
  aggregateVerifications
} from 'helpers/verificationHelpers';

class LongTextQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    storeAnswer: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,
    changeCurrentState: PropTypes.func.isRequired,
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'text'
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

  onChange = (value) => {
    var id = this.props.compiledQuestion.id;
    this.resetError();
    this.props.changeCurrentState({
      answerValue: value
    });
    this.props.storeAnswer({
      id,
      value
    });
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
      <div style={{'overflow': 'hidden', 'width': '100%'}}>
        <LongTextInput
          onEnterKey={this.onEnterKeyDown}
          onChange={this.onChange}
          errors={this.state.errors}
          value={this.props.value}
          placeholder={this.props.compiledQuestion.placeholder}
          isDisabled={this.state.isDisabled}
        />
      </div>
    );
  }
}

export default LongTextQuestion;
