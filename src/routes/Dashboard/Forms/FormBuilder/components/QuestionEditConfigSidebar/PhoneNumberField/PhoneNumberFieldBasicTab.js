import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBoxRow from 'components/QuestionEditFields/SelectBoxRow';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class PhoneNumberFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    const { setQuestionInfo, currentElement, questions } = this.props;
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
      <RequiredValidation {...this.props} />
      <EditSection>
        <SelectBoxRow
          title="Default country code"
          value={currentElement.question.country_code}
          optionsList={[{label: '+ Australia (AU)', value: 'AU'}]}
          onChange={function (newValue) { setQuestionInfo({'country_code': newValue}); }} />
      </EditSection>
    </div>);
  }
}

export default PhoneNumberFieldBasicTab;
