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

class DateFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  _onDayFormatChanged = (newValue) => {
    this.props.setQuestionInfo({
      'format': {
        'day': newValue
      }
    });
  };

  _onMonthFormatChanged = (newValue) => {
    this.props.setQuestionInfo({
      'format': {
        'month': newValue
      }
    });
  };

  _onYearFormatChanged = (newValue) => {
    this.props.setQuestionInfo({
      'format': {
        'year': newValue
      }
    });
  };

  render() {
    const {
      currentElement,
      questions
    } = this.props;
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));

    const formatSelectRowStyle = {
      'marginBottom': '15px'
    };

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
        <SectionTitle title={'Output format'} style={{'marginBottom': '8px'}} />
        <SelectBoxRow
          label="Day"
          title="Day"
          value={'D'}
          style={formatSelectRowStyle}
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
          style={formatSelectRowStyle}
          onChange={this._onMonthFormatChanged}
        />
        <SelectBoxRow
          title="Year"
          value={'YYYY'}
          optionsList={[
            {label: 'YYYY', value: 'YYYY'},
            {label: 'YY', value: 'YY'}
          ]}
          style={formatSelectRowStyle}
          onChange={this._onYearFormatChanged}
        />
      </EditSection>
      <RequiredValidation {...this.props} />
    </div>);
  }
}

export default DateFieldBasicTab;
