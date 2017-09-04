import React, {
  Component,
  PropTypes
} from 'react';

import MultipleChoice from 'components/QuestionInputs/MultipleChoice';

class MultipleChoiceQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.array,
    handleEnter: PropTypes.func,
    changeCurrentState: PropTypes.func,
    storeAnswer: PropTypes.func
  };

  static defaultProps = {
    choices: [],
    value: []
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
    var id = this.props.compiledQuestion.id;
    this.props.changeCurrentState({
      answerValue: value
    });
    this.props.storeAnswer({
      id,
      value
    });
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

  render() {
    const {
      choices,
      allowMultiple,
      includeOther
    } = this.props.compiledQuestion;
    const { value } = this.props;
    return (<MultipleChoice
      onChange={this.handleChange}
      choices={choices}
      includeOther={includeOther}
      onEnterKey={this.handleEnter}
      value={value}
      errors={this.state.errors}
      allowMultiple={allowMultiple} />
    );
  }
}

export default MultipleChoiceQuestion;
