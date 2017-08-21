import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import LengthValidation from 'components/QuestionEditFields/LengthValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

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
    // todo: Dry validation value retrieval
    const validations = currentElement.question['validations'];
    const minLengthValidators = validations.filter((v) => v.type === 'minLength');
    var minLengthValue;
    if (minLengthValidators.length) {
      minLengthValue = minLengthValidators[0].value;
    } else {
      minLengthValue = '';
    }
    var maxLengthValue;
    const maxLengthValidators = validations.filter((v) => v.type === 'maxLength');
    if (maxLengthValidators.length) {
      maxLengthValue= maxLengthValidators[0].value;
    } else {
      maxLengthValue = '';
    }
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';

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
      <RequiredValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        checked={isRequired}
      />
    </div>);
  }
}

export default ShortTextFieldBasicTab;
