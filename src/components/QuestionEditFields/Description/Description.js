import React, {
  Component,
  PropTypes
} from 'react';

import {
  Collapse
} from 'react-bootstrap';
import Switch from 'rc-switch';
import _ from 'lodash';
import EditSection from '../EditSection/EditSection';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import styles from './Description.scss';

class Description extends Component {
  static propTypes = {
    currentElement: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    setQuestionInfo: PropTypes.func.isRequired,
    resetQuestionInfo: PropTypes.func.isRequired
  };

  setDescription = (value) => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      'question_description': value
    });
  }

  toggleDescription = (isOn) => {
    const { setQuestionInfo, resetQuestionInfo } = this.props;
    isOn
      ? setQuestionInfo({ 'question_description': '' })
      : resetQuestionInfo('question_description');
  }

  render() {
    const { currentElement: { question }, questions } = this.props;
    const description = _.defaultTo(question.question_description, '');
    const isDescriptionVisible = typeof question.question_description !== 'undefined';
    return (
      <EditSection>
        <div className={styles.sectionSwitchWrapper}>
          <Switch onChange={this.toggleDescription} checked={isDescriptionVisible} />
        </div>
        <Collapse in={isDescriptionVisible}>
          <div className={styles.textEditorWrapper}>
            <QuestionRichTextEditor
              title="Question description"
              value={description}
              setValue={this.setDescription}
              questions={questions}
            />
          </div>
        </Collapse>
      </EditSection>
    );
  }
}

export default Description;
