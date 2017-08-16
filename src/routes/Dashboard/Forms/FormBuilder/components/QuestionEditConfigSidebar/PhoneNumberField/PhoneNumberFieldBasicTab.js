import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBoxRow from 'components/QuestionEditFields/SelectBoxRow';

class PhoneNumberFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    updateQuestionProp: PropTypes.func.isRequired
  };
  render() {
    const { updateQuestionProp, currentElement } = this.props;
    return (<div>
      <InstructionDescription {...this.props} />
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
          onChange={function (newValue) { updateQuestionProp(newValue, 'country_code'); }} />
      </EditSection>
    </div>);
  }
}

export default PhoneNumberFieldBasicTab;
