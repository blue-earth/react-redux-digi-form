import connect from 'redux/utils/connect';
import {
  purchasePlan,
  goToNextStep,
  fetchPlans,
  goToPreviousStep,
  verifySubdomain,
  setEmail,
  setSelectedPlanConfig,
  setPaymentMethod,
  setDisplaySubdomainHint,
  INIT_BUSINESS_PLAN_STATE
} from 'redux/modules/businessPlan';

import BusinessPlan from '../components/BusinessPlan';

const mapActionCreators = {
  purchasePlan,
  goToNextStep,
  goToPreviousStep,
  fetchPlans,
  verifySubdomain,
  setEmail,
  setSelectedPlanConfig,
  setPaymentMethod,
  setDisplaySubdomainHint
};

const mapStateToProps = (state) => {
  const { businessPlan } = state;
  const {
    plansConfig,
    stepIndex,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPageBusy,
    showSubdomainHint,
    currentlySelectedPlan
  } = businessPlan || INIT_BUSINESS_PLAN_STATE;
  return {
    plansConfig,
    stepIndex,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPageBusy,
    showSubdomainHint,
    currentlySelectedPlan
  };
};

export default connect(mapStateToProps, mapActionCreators)(BusinessPlan);
