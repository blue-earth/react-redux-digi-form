import React, {
  Component,
  PropTypes
} from 'react';
import styles from './BusinessPlanStep.scss';
import { Grid } from 'react-bootstrap';
import classNames from 'classnames';

class BusinessPlanStep extends Component {
  static propTypes = {
    step: PropTypes.number
  };

  render() {
    const { step } = this.props;

    return (
      <Grid fluid className={styles.businessPlanStepWrapper}>
        <h5 className={styles.stepContent}>
          <div className={classNames({
            [styles.stepIndicatorWrapper]: true,
            [styles.activeStep]: step === 0
          })}>
            <span className={classNames({
              [styles.stepIndicator]: true,
              [styles.activeStepIndicator]: step === 0
            })}>1</span>
            <span className={styles.stepTitle}>Configure</span>
          </div>
          <div className={classNames({
            [styles.stepIndicatorWrapper]: true,
            [styles.activeStep]: step === 1
          })}>
            <span className={classNames({
              [styles.stepIndicator]: true,
              [styles.activeStepIndicator]: step === 1
            })}>2</span>
            <span className={styles.stepTitle}>Purchase</span>
          </div>
        </h5>
      </Grid>
    );
  }
}

export default BusinessPlanStep;
