import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import { Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { findItemById } from 'helpers/pureFunctions';
import {
  getCompiledQuestion,
  groupFormQuestions
} from 'helpers/formInteractiveHelper';
import AnswerValue from 'components/AnswerValue';
import EditAnswerModal from './EditAnswerModal';
import EditButton from './EditButton';
import styles from './SubmissionReview.scss';

export default class SubmissionReview extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * questions: form questions.
     */
    questions: PropTypes.array,

    /*
     * answers: Redux state that stores the array of answered values
     */
    answers: PropTypes.array.isRequired,
    /*
     * showModal: Redux modal show
     */
    showModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      questionGroups: groupFormQuestions(props.questions)
    };
  }

  toggleGroupOpenState(index) {
    const { questionGroups } = this.state;
    const isOpen = !_.get(questionGroups, [index, 'open']);
    _.set(questionGroups, [index, 'open'], isOpen);
    this.setState({ questionGroups });
  }

  renderPanelHeader(title, index) {
    const that = this;
    return (
      <div onClick={function () { that.toggleGroupOpenState(index); }}>
        {title}
      </div>
    );
  }

  renderGroupQuestions(groupQuestions) {
    const { answers, showModal } = this.props;
    return (
      <ol className={styles.questionList}>
        {
          _.map(groupQuestions, function (question, index) {
            const finalQuestion = getCompiledQuestion(question, answers);
            const answer = findItemById(answers, finalQuestion.questionId);
            return (
              <li className={styles.questionListItem} key={index}>
                <div className={styles.questionListItemInner}>
                  <div className={styles.questionInstruction}>
                    {finalQuestion.questionInstruction || finalQuestion.instruction}
                  </div>
                  <div className={styles.answer}>
                    {answer && <AnswerValue value={answer.value} question={question} />}
                  </div>
                  <div className={styles.editButtonWrapper}>
                    <EditButton onClick={function () {
                      showModal('editAnswerModal', { question: finalQuestion, value: answer.value });
                    }} />
                  </div>
                </div>
              </li>
            );
          })
        }
      </ol>
    );
  }

  render() {
    const { questionGroups } = this.state;
    const that = this;
    return (
      <div className={styles.submissionReview}>
        {
          questionGroups.map(function (group, index) {
            const isOpen = _.get(questionGroups, [index, 'open']);
            const panelClass = classNames({
              [styles.panel]: true,
              [styles.open]: isOpen
            });
            return (
              <Panel key={index} collapsible expanded={isOpen} className={panelClass}
                header={that.renderPanelHeader(group.title, index)}
              >
                {that.renderGroupQuestions(group.questions)}
              </Panel>
            );
          })
        }
        <EditAnswerModal />
      </div>
    );
  }
}
