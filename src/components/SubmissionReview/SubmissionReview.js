import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import { Panel } from 'react-bootstrap';
import { findItemById } from 'helpers/pureFunctions';
import {
  getCompiledQuestion,
  groupFormQuestions,
  stringifyAnswerValue
} from 'helpers/formInteractiveHelper';
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
    questions: PropTypes.object,

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

  renderGroupQuestions(groupQuestions) {
    const { answers } = this.props;
    return (
      <ol>
        {
          _.map(groupQuestions, function (question, index) {
            const finalQuestion = getCompiledQuestion(question, answers);
            console.log(groupQuestions, question);
            const answer = findItemById(answers, finalQuestion.questionId);
            return (
              <li>
                <div>{finalQuestion.questionInstruction}</div>
                <div>{stringifyAnswerValue(answer)}</div>
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
            return (
              <Panel key={index} collapsible expanded={isOpen} header={group.title}>
                {that.renderGroupQuestions(group.questions)}
              </Panel>
            );
          })
        }
      </div>
    );
  }
}
