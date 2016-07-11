import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { MdCheck } from 'react-icons/lib/md';
import styles from './StepIndicator.scss';

class StepIndicator extends Component {

  static propTypes = {
    step: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['pending', 'active', 'completed', 'preview'])
  };

  render() {
    const { status, step, totalSteps } = this.props;
    const stepClasses = classNames({
      [styles.step]: true,
      [styles[status]]: true
    });
    return (
      <div className={stepClasses}>
        {status === 'pending'
          ? step
          : status === 'completed'
            ? <MdCheck className={styles.greenIcon} />
            : `${step} of ${totalSteps}`
        }
      </div>
    );
  }
}

export default StepIndicator;
