import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import { Panel } from 'react-bootstrap';
import { groupFormQuestions } from 'helpers/formInteractiveHelper';
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
    answers: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      questionGroups: groupFormQuestions(props.questions)
    };
  }

  render() {
    const { questionGroups } = this.state;

    return (
      <div className={styles.submissionReview}>
        {
          questionGroups.map(function (group, index) {
            const isOpen = _.get(questionGroups, [index, 'open']);
            return (
              <Panel key={index} collapsible expanded={isOpen} header={group.title}>
                {group.questions.length}
              </Panel>
            );
          })
        }
      </div>
    );
  }
}
