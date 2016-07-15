import React, {
  Component,
  PropTypes
} from 'react';
import classNames from 'classnames';
import { MdCheck } from 'react-icons/lib/md';
import styles from './StepIndicator.scss';

class StepIndicator extends Component {

  static propTypes = {
    step: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['pending', 'active', 'completed', 'preview'])
  };

  renderPending() {
    const { step } = this.props;
    return step;
  }

  renderActive() {
    const { step, totalSteps } = this.props;
    return `${step} of ${totalSteps}`;
  }

  renderPreview() {
    const { step, totalSteps } = this.props;
    return `${step} of ${totalSteps}`;
  }

  renderCompleted() {
    return <MdCheck className={styles.greenIcon} />;
  }

  render() {
    const { status } = this.props;
    const stepClasses = classNames({
      [styles.step]: true,
      [styles[status]]: true
    });

    var output;
    switch (status) {
      case 'pending':
        output = this.renderPending();
        break;
      case 'active':
        output = this.renderActive();
        break;
      case 'completed':
        output = this.renderCompleted();
        break;
      case 'preview':
        output = this.renderPreview();
        break;
    }
    return (
      <div className={stepClasses}>
        {output}
      </div>
    );
  }
}

export default StepIndicator;
