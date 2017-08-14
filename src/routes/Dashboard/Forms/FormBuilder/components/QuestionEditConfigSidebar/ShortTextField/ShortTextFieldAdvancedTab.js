import React, {
  Component,
  PropTypes
} from 'react';
import AnswerOutputArea from 'components/QuestionEditFields/AnswerOutputArea';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import LengthValidation from 'components/QuestionEditFields/LengthValidation';
import RangeValidation from 'components/QuestionEditFields/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';

class ShortTextFieldAdvancedTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    return (<div>
      <InstructionDescription {...this.props} />
      <AnswerOutputArea {...this.props} />
      <LengthValidation {...this.props} />
      <RangeValidation {...this.props} />
      <RequiredValidation {...this.props} />
    </div>);
  }
}

export default ShortTextFieldAdvancedTab;
