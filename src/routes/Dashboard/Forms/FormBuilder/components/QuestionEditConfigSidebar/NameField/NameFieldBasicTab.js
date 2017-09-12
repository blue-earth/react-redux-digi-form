import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import SwitchRow from 'components/QuestionEditFields/SwitchRow';
import EditSection from 'components/QuestionEditFields/EditSection';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class NameFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired,
    deleteMappingInfoByPath: PropTypes.func.isRequired
  };

  handleMiddleNameChange = (isOn) => {
    const { setQuestionInfo, deleteMappingInfoByPath } = this.props;
    if (isOn) {
      setQuestionInfo({include_middle_name: true});
    } else {
      setQuestionInfo({include_middle_name: false});
      // remove from mappingInfo
      deleteMappingInfoByPath('middle_name');
    }
  };

  render() {
    const {
      currentElement,
      questions,
      setValidationInfo,
      resetValidationInfo
    } = this.props;
    const validations = currentElement.question['validations'];
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
      <EditSection>
        <SwitchRow title="Include middle name"
          checked={currentElement.question.include_middle_name || false}
          onChange={this.handleMiddleNameChange} />
      </EditSection>
      <RequiredValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        checked={isRequired}
      />
    </div>);
  }
}

export default NameFieldBasicTab;
