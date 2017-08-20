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
    setQuestionInfo: PropTypes.func.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired
  };
  render() {
    const {
      currentElement,
      questions,
      setValidationInfo,
      resetValidationInfo
    } = this.props;

    const validations = currentElement.question['validations'];
    const minLengthValidators = validations.filter((v) => v.type === 'minLength');
    var minLengthValue;
    if (minLengthValidators.length) {
      minLengthValue = minLengthValidators[0].value;
    } else {
      minLengthValue = null;
    }
    var maxLengthValue;
    const maxLengthValidators = validations.filter((v) => v.type === 'maxLength');
    if (maxLengthValidators.length) {
      maxLengthValue= maxLengthValidators[0].value;
    } else {
      maxLengthValue = null;
    }

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
      <LengthValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        minLengthValue={minLengthValue}
        maxLengthValue={maxLengthValue}
      />
      <RangeValidation {...this.props} />
      <RequiredValidation {...this.props} />
    </div>);
  }
}

export default ShortTextFieldBasicTab;
