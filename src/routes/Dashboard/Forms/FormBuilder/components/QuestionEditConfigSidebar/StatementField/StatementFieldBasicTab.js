import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from 'components/QuestionEditFields/EditSection';
import QuestionRichTextEditor from 'components/QuestionEditFields/QuestionRichTextEditor';
import { getQuestionsByType, getQuestionsById, mapQuestionsToDropdown } from 'helpers/formBuilderHelper';

class StatementFieldBasicTab extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };
  render() {
    const { currentElement, questions, setQuestionInfo } = this.props;
    const filteredQuestions = mapQuestionsToDropdown(getQuestionsByType(questions, 'Group', false));
    const otherQuestions = getQuestionsById(filteredQuestions, currentElement.id, false);
    return (<div>
      <EditSection>
        <QuestionRichTextEditor
          title="Statement heading"
          value={currentElement.question.question_instruction || ''}
          setValue={function (newValue) { setQuestionInfo({'question_instruction': newValue}); }}
          filteredQuestions={otherQuestions}
        />
      </EditSection>
      <EditSection>
        <QuestionRichTextEditor
          title="Statement text"
          value={currentElement.question.instruction || ''}
          setValue={function (newValue) { setQuestionInfo({'instruction': newValue}); }}
          filteredQuestions={otherQuestions}
        />
      </EditSection>
    </div>);
  }
}

export default StatementFieldBasicTab;
