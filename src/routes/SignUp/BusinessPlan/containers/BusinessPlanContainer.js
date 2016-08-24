import connect from 'redux/utils/connect';
import {
  purchasePlan,
  goToNextStep,
  fetchPlans,
  goToPreviousStep,
  verifySubdomain,
  setPlanConfig,
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
  setPlanConfig,
  setPaymentMethod,
  setDisplaySubdomainHint
};

const mapStateToProps = (state, ownProps) => {
  const { businessPlan } = state;
  const { plan, period } = ownProps.location.query;
  const {
    plans,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing,
    showSubdomainHint
  } = businessPlan || INIT_BUSINESS_PLAN_STATE;
  return {
    plans,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing,
    showSubdomainHint,
    plan,
    period
  };
};

export default connect(mapStateToProps, mapActionCreators)(BusinessPlan);
