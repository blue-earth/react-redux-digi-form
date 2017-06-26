import React, {
  Component,
  PropTypes
} from 'react';
import styles from './StepIndicator.scss';
import { Grid } from 'react-bootstrap';
import classNames from 'classnames';

class StepIndicator extends Component {
  static propTypes = {
    activeStep: PropTypes.number,
    steps: PropTypes.array
  };

  render() {
    const { activeStep, steps } = this.props;
    return (
      <Grid fluid className={styles.stepWrapper}>
        <h5 className={styles.stepContent}>
          { steps.map((step, index) => {
            return (
              <div key={index} className={classNames({
                [styles.stepIndicatorWrapper]: true,
                [styles.activeStep]: activeStep === index
              })}>
                <span className={classNames({
                  [styles.stepIndicator]: true,
                  [styles.activeStepIndicator]: activeStep === index
                })}>{step.number}</span>
                <span className={styles.stepTitle}>{step.name}</span>
              </div>
            );
          }) }
        </h5>
      </Grid>
    );
  }
}

export default StepIndicator;
