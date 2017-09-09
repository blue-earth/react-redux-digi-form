import React, {
  Component,
  PropTypes
} from 'react';
import Statement from '../../QuestionInputs/Statement';

class StatementQuestion extends Component {
  static propTypes = {
    compiledQuestion: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func.isRequired,
    handleEnter: PropTypes.func.isRequired,
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
    this.props.onChange(value);
  };

  onEnterKeyDown = () => {
    this.props.handleEnter();
  };

  validate(cb) {
    return cb(true);
  }

  // TODO: consent checkbox?

  render() {
    return (
      <div>
        <Statement instruction={this.props.compiledQuestion.instruction} />
      </div>
    );
  }
}

export default StatementQuestion;
