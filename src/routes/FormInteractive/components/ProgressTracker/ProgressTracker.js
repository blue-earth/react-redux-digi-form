import React, {
  Component,
  PropTypes
} from 'react';
import {
  groupFormQuestions
} from 'helpers/formInteractiveHelper';
import ArrowButton from './ArrowButton';
import styles from './ProgressTracker.scss';

class ProgressTracker extends Component {
  static propTypes = {
    questions: PropTypes.object.isRequired
  }

  static contextTypes = {
    primaryColor: PropTypes.string,
    isLastSection: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      questionGroups: groupFormQuestions(props.questions)
    };
  }

  addHoverClass = () => {

  }

  render() {
    const { questionGroups } = this.state;
    const { primaryColor } = this.context;
    return (
      <div className={styles.wrapper}>
        <div className={styles.prevButtonWrapper}>
          <ArrowButton direction="left" />
        </div>
        <div className={styles.steps}>
        {
          questionGroups.map((questionGroup, index) => (
            <div className={styles.step}>
              {questionGroup.title}
            </div>
          ))
        }
        </div>
        <div className={styles.nextButtonWrapper}>
          <ArrowButton direction="right" />
        </div>
        <div className={styles.progressbar} style={{ backgroundColor: primaryColor }}>
          <div className={styles.progressbarValue} />
        </div>
      </div>
    );
  }
}

export default ProgressTracker;
