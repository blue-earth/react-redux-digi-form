import React, {
  Component,
  PropTypes
} from 'react';
import ArrowButton from './ArrowButton';
import styles from './ProgressTracker.scss';
import classNames from 'classnames';

class ProgressTracker extends Component {
  static propTypes = {
    sectionTitleList: PropTypes.array,
    currentSectionIndex: PropTypes.number
  };
  static defaultProps = {
    sectionTitleList: [],
    currentSectionIndex: 0
  };

  static contextTypes = {
    primaryColor: PropTypes.string
  };

  addHoverClass = () => {

  }

  render() {
    const { sectionTitleList, currentSectionIndex } = this.props;
    const { primaryColor } = this.context;
    if (sectionTitleList && sectionTitleList.length) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.prevButtonWrapper}>
            <ArrowButton direction="left" />
          </div>
          <ol className={styles.stepsList}>
          {
            sectionTitleList.map((questionGroupTitle, index) => (
              <li key={index} className={classNames({
                [styles.stepItem]: true,
                [styles.active]: index === currentSectionIndex})}>
                {index+1}. {questionGroupTitle}
              </li>
            ))
          }
          </ol>
          <div className={styles.nextButtonWrapper}>
            <ArrowButton direction="right" />
          </div>
          <div className={styles.progressbar} style={{ backgroundColor: primaryColor }}>
            <div className={styles.progressbarValue} />
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ProgressTracker;
