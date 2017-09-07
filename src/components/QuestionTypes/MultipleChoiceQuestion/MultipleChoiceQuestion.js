import React, {
  Component,
  PropTypes
} from 'react';

import MultipleChoice from 'components/QuestionInputs/MultipleChoice';

class MultipleChoiceQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.array,
    isInputLocked: PropTypes.bool,
    handleEnter: PropTypes.func,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: [],
    isInputLocked: false
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };
  }
  _resetError() {
    this.setState({
      'errors': []
    });
  }
  handleChange = (value) => {
    this._resetError();
    this.props.onChange(value);
  }

  handleEnter = () => {
    const { validations } = this.props.compiledQuestion;
    if (validations && validations.indexOf('isRequired') > -1) {
      if (this.props.value.length === 0) {
        this.setState({
          'errors': ['This question is mandatory']
        });
      }
    } else {
      this.props.handleEnter();
    }
  };

  validate(cb) {
    const {
      value,
      compiledQuestion: { validations }
    } = this.props;
    if (validations && validations.indexOf('isRequired') > -1) {
      if (value.length === 0) {
        this.setState({
          'errors': ['This question is mandatory']
        });
        return cb(false);
      } else {
        return cb(true);
      }
    } else {
      return cb(true);
    }
  }

  // no verifications currently required for this question type

  render() {
    const {
      choices,
      allowMultiple,
      includeOther
    } = this.props.compiledQuestion;
    const { value } = this.props;
    return (<MultipleChoice
      value={value}
      choices={choices}
      errors={this.state.errors}
      includeOther={includeOther}
      allowMultiple={allowMultiple}
      onChange={this.handleChange}
      onEnterKey={this.props.handleEnter} />
    );
  }
}

export default MultipleChoiceQuestion;
