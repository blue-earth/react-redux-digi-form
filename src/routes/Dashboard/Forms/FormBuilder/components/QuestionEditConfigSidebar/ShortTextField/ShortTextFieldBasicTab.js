import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import LengthValidation from 'components/QuestionEditFields/LengthValidation';
import RangeValidation from 'components/QuestionEditFields/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class ShortTextFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    const { currentElement, questions } = this.props;
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));
    return (<div>
      <InstructionDescription
        currentElementId={currentElement.id}
        questionInstruction={currentElement.question.question_instruction}
        questionDescription={currentElement.question.question_description}
        filteredQuestions={filteredQuestions}
        setQuestionInfo={this.props.setQuestionInfo} />
      <EditSection>
        <AnswerOutputTypeStatus
          status={this.props.currentElement.defaultMappingType} />
      </EditSection>
      <LengthValidation {...this.props} />
      <RangeValidation {...this.props} />
      <RequiredValidation {...this.props} />
    </div>);
  }
}

export default ShortTextFieldBasicTab;
