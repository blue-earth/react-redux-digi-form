import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RangeValidation from 'components/QuestionEditFields/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class NumberFieldBasicTab extends Component {
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
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));
    const validations = currentElement.question['validations'];
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';

    var minRangeValue;
    const minRangeValidators = validations.filter((v) => v.type === 'minimum');
    if (minRangeValidators.length) {
      minRangeValue = minRangeValidators[0].value;
    } else {
      minRangeValue = '';
    }

    var maxRangeValue;
    const maxRangeValidators = validations.filter((v) => v.type === 'maximum');
    if (maxRangeValidators.length) {
      maxRangeValue= maxRangeValidators[0].value;
    } else {
      maxRangeValue = '';
    }

    return (<div>
      <InstructionDescription
        currentElementId={currentElement.id}
        questionInstruction={currentElement.question.question_instruction}
        questionDescription={currentElement.question.question_description}
        filteredQuestions={filteredQuestions}
        setQuestionInfo={this.props.setQuestionInfo} />
      <EditSection>
        <AnswerOutputTypeStatus
          status={currentElement.defaultMappingType} />
      </EditSection>
      <RangeValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        minRangeValue={minRangeValue}
        maxRangeValue={maxRangeValue}
      />
      <RequiredValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        checked={isRequired}
      />
    </div>);
  }
}

export default NumberFieldBasicTab;
