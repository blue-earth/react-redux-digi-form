import React, {
  Component,
  PropTypes
} from 'react';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import AnswerOutputTypeStatus from 'components/QuestionEditFields/AnswerOutputTypeStatus';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import EditSection from 'components/QuestionEditFields/EditSection';
import SelectBoxRow from 'components/QuestionEditFields/SelectBoxRow';
import SectionTitle from 'components/QuestionEditFields/SectionTitle';
import { getQuestionsByType, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class DateFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    setValidationInfo: PropTypes.func.isRequired,
    resetValidationInfo: PropTypes.func.isRequired
  };

  _onDayFormatChanged = (newValue) => {
    var newFormat = _.merge(this.props.currentElement.question.format, {'day': newValue});
    this.props.setQuestionInfo({
      'format': newFormat
    });
  };

  _onMonthFormatChanged = (newValue) => {
    var newFormat = _.merge(this.props.currentElement.question.format, {'month': newValue});
    this.props.setQuestionInfo({
      'format': newFormat
    });
  };

  _onYearFormatChanged = (newValue) => {
    var newFormat = _.merge(this.props.currentElement.question.format, {'year': newValue});
    this.props.setQuestionInfo({
      'format': newFormat
    });
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
      <EditSection withSpacing>
        <SectionTitle title={'Output format'} />
        <SelectBoxRow
          label="Day"
          title="Day"
          value={'D'}
          optionsList={[
            {label: 'D', value: 'D'},
            {label: 'DD', value: 'DD'},
            {label: '1st', value: 'Do'}
          ]}
          onChange={this._onDayFormatChanged}
        />
        <SelectBoxRow
          title="Month"
          value={'MM'}
          optionsList={[
            {label: 'MM', value: 'MM'},
            {label: 'M', value: 'M'}
          ]}
          onChange={this._onMonthFormatChanged}
        />
        <SelectBoxRow
          title="Year"
          value={'YYYY'}
          optionsList={[
            {label: 'YYYY', value: 'YYYY'},
            {label: 'YY', value: 'YY'}
          ]}
          onChange={this._onYearFormatChanged}
        />
      </EditSection>
      <RequiredValidation
        setValidationInfo={setValidationInfo}
        resetValidationInfo={resetValidationInfo}
        checked={isRequired}
      />
    </div>);
  }
}

export default DateFieldBasicTab;
