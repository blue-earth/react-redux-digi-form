import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from '../EditSection/EditSection';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import _ from 'lodash';
import styles from './InstructionDescription.scss';

class Instruction extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired
  };

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

  render() {
    const { currentElement: { question }, questions } = this.props;
    const instruction = _.defaultTo(question.question_instruction, '');
    const description = _.defaultTo(question.question_description, '');
    return (
      <EditSection>
        <div className={styles.textEditorWrapper}>
          <QuestionRichTextEditor
            title="Question"
            value={instruction}
            setValue={this.setInstruction}
            questions={questions}
          />
        </div>
        <div className={styles.textEditorWrapper}>
          <QuestionRichTextEditor
            title="Question description"
            value={description}
            popoverId="questionDescription"
            setValue={this.setDescription}
            questions={questions}
          />
        </div>
      </EditSection>
    );
  }
}

export default Instruction;
