import React, {
  Component,
  PropTypes
} from 'react';
import {
  dashboardUrl,
  submissionsPath
  // formsPath,
  // usersPath,
  // settingsPath
} from 'helpers/urlHelper';
import styles from './FormBuilderNav.scss';
import { MdHome } from 'react-icons/lib/md';
import { FaAngleDoubleRight } from 'react-icons/lib/fa';
// import _ from 'lodash';

class FormBuilderNav extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    currentStep: PropTypes.string,
    setCurrentStep: PropTypes.func.isRequired
  };

  handleStepClick = (stepKey) => {
    // console.log('handleStepClick: ', stepKey);
    this.props.setCurrentStep(stepKey);
  }

  onClickHome = () => {
    const { goTo } = this.props;
    goTo(dashboardUrl(submissionsPath));
  }

  get builderSteps() {
    return [
      {
        stepKey: 'select',
        label: 'Select',
        clickHandler: this.handleStepClick
      },
      {
        stepKey: 'arrange',
        label: 'Arrange',
        clickHandler: this.handleStepClick
      },
      {
        stepKey: 'configure',
        label: 'Configure',
        clickHandler: this.handleStepClick
      },
      {
        stepKey: 'send',
        label: 'Send',
        clickHandler: this.handleStepClick
      }
    ];
  }

  render() {
    return (
      <div className={styles.FormBuilderNavWrapper}>
        <div className={styles.breadcrumbs}>
          <a className={styles.homeLink} onClick={this.onClickHome}>
            <MdHome />
          </a>
          <FaAngleDoubleRight />
          {this.props.title}
        </div>
        <div className={styles.actions}>
          TODO buttons
        </div>
        <ul className={styles.formStepsNav}>
          {
          this.builderSteps.map((step, index) => {
            return (
              <li key={step.stepKey} className={this.props.currentStep === step.stepKey ? styles.active : ''}>
                <a onClick={function () { step.clickHandler(step.stepKey); }}>
                  <span className={styles.stepNum}>{index + 1}</span> {step.label}
                </a>
              </li>
            );
          })
        }
        </ul>
      </div>
    );
  }
}

export default FormBuilderNav;
