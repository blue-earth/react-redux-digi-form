import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from 'components/QuestionEditFields/EditSection';
import QuestionRichTextEditor from 'components/QuestionEditFields/QuestionRichTextEditor';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import { getQuestionsByType, getQuestionsById, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';
import _ from 'lodash';

class UploadFieldBasicTab extends Component {
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
      setQuestionInfo,
      setValidationInfo,
      resetValidationInfo
    } = this.props;
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));
    const otherQuestions = getQuestionsById(filteredQuestions, currentElement.id, false);
    const validations = currentElement.question['validations'];
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';
    return (<div>
      <EditSection>
        <QuestionRichTextEditor
          title="Upload heading"
          value={currentElement.question.question_instruction || ''}
          setValue={function (newValue) { setQuestionInfo({'question_instruction': newValue}); }}
          filteredQuestions={otherQuestions}
        />
      </EditSection>
      <EditSection>
        <QuestionRichTextEditor
          title="Question description"
          value={currentElement.question.question_description || ''}
          setValue={function (newValue) { setQuestionInfo({'question_description': newValue}); }}
          filteredQuestions={otherQuestions}
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

export default UploadFieldBasicTab;
