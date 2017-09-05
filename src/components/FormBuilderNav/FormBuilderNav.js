import React, {
  Component,
  PropTypes
} from 'react';
import {
  dashboardUrl,
  submissionsPath
} from 'helpers/urlHelper';
import styles from './FormBuilderNav.scss';
import AppButton from 'components/Buttons/AppButton/AppButton';
import DashboardPageInnerLayout from 'layouts/DashboardPageInnerLayout';
import {
  MdHome,
  MdArrowBack,
  MdArrowForward
} from 'react-icons/lib/md';
import {
  FaAngleDoubleRight,
  FaFloppyO
} from 'react-icons/lib/fa';
import _ from 'lodash';

class FormBuilderNav extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func.isRequired,
    /**
     * Document title
     * todo: rename it to documentTitle
     */
    title: PropTypes.string.isRequired,
    currentStep: PropTypes.string,
    setCurrentStep: PropTypes.func.isRequired
  };

  handleStepClick = (stepKey) => {
    this.props.setCurrentStep(stepKey);
  }
  handleNextClick = () => {
    const { currentStep } = this.props;
    var i = _.findIndex(this.builderSteps, function (o) { return o.stepKey === currentStep; });
    this.props.setCurrentStep(this.builderSteps[i + 1].stepKey);
  }
  handlePrevClick = () => {
    const { currentStep } = this.props;
    var i = _.findIndex(this.builderSteps, function (o) { return o.stepKey === currentStep; });
    this.props.setCurrentStep(this.builderSteps[i - 1].stepKey);
  }

  onClickHome = () => {
    const { goTo } = this.props;
    goTo(dashboardUrl(submissionsPath));
  }

  get builderSteps() {
    return [
      {
        stepKey: 'select',
        label: 'Select'
      },
      {
        stepKey: 'arrange',
        label: 'Arrange'
      },
      {
        stepKey: 'configure',
        label: 'Configure'
      },
      {
        stepKey: 'publish',
        label: 'Publish'
      }
    ];
  }

  // TODO: functionality for Preview and floppydisk buttons

  render() {
    const that = this;
    return (
      <div className={styles.FormBuilderNavWrapper}>
        <DashboardPageInnerLayout extraStyle={{display: 'table', 'tableLayout': 'fixed'}}>
          <div className={styles.breadcrumbs}>
            <a className={styles.homeLink} onClick={this.onClickHome}>
              <MdHome size={25} />
            </a>
            <FaAngleDoubleRight className={styles.crumbDivider} />
            <span className={styles.formTitle}>{this.props.title}</span>
          </div>
          <ul className={styles.formStepsNav}>
            {
            this.builderSteps.map((step, index) => {
              return (
                <li key={step.stepKey} className={this.props.currentStep === step.stepKey ? styles.active : ''}>
                  <a onClick={function () { that.handleStepClick(step.stepKey); }}>
                    <span className={styles.stepNum}>{index + 1}</span>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </a>
                </li>
              );
            })
          }
          </ul>
          <div className={styles.actions}>
            <AppButton type="secondary"><FaFloppyO /></AppButton>
            <AppButton type="secondary">Preview</AppButton>
            <AppButton type="secondary" extraClass={styles.prev} onClick={this.handlePrevClick}
              isDisabled={this.props.currentStep === this.builderSteps[0].stepKey}>
              <MdArrowBack />
            </AppButton>
            <AppButton type="secondary" extraClass={styles.next} onClick={this.handleNextClick}
              isDisabled={this.props.currentStep === this.builderSteps[this.builderSteps.length - 1].stepKey}>
              <MdArrowForward />
            </AppButton>
          </div>
        </DashboardPageInnerLayout>
      </div>
    );
  }
}

export default FormBuilderNav;
