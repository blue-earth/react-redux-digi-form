import React, {
  Component,
  PropTypes
} from 'react';
import { getQuestionsById } from 'helpers/formBuilderHelper';
import EditSection from '../EditSection';
import QuestionRichTextEditor from '../QuestionRichTextEditor';
import styles from './InstructionDescription.scss';

class InstructionDescription extends Component {
  static propTypes = {
    currentElementId: PropTypes.number,
    questionInstruction: PropTypes.string,
    questionDescription: PropTypes.string,
    filteredQuestions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

  static defaultProps = {
    questionInstruction: '',
    questionDescription: ''
  }

  setInstruction = (value) => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      'question_instruction': value
    });
  }

  setDescription = (value) => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      'question_description': value
    });
  }

  get otherQuestions() {
    const { filteredQuestions, currentElementId } = this.props;
    return getQuestionsById(filteredQuestions, currentElementId, false);
  }

  render() {
    const { questionInstruction, questionDescription } = this.props;
    return (
      <EditSection>
        <div className={styles.textEditorWrapper}>
          <QuestionRichTextEditor
            title="Question"
            value={questionInstruction}
            setValue={this.setInstruction}
            filteredQuestions={this.otherQuestions}
          />
        </div>
        <div className={styles.textEditorWrapper}>
          <QuestionRichTextEditor
            title="Question description"
            value={questionDescription}
            popoverId="questionDescription"
            setValue={this.setDescription}
            filteredQuestions={this.otherQuestions}
          />
        </div>
      </EditSection>
    );
  }
}

export default InstructionDescription;
