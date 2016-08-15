import React, {
  Component,
  PropTypes
} from 'react';
import EditSection from '../EditSection/EditSection';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import _ from 'lodash';
import styles from './Instruction.scss';

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

  render() {
    const { currentElement: { question }, questions } = this.props;
    const instruction = _.defaultTo(question.question_instruction, '');
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
      </EditSection>
    );
  }
}

export default Instruction;
