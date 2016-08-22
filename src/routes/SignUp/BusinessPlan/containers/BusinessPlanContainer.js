import connect from 'redux/utils/connect';
import {
  purchasePlan,
  goToNextStep,
  fetchPlans,
  goToPreviousStep,
  verifySubdomain,
  setPlanConfig,
  setPaymentMethod,
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
  setPaymentMethod
};

const mapStateToProps = (state) => {
  const { businessPlan } = state;
  const { plan, period } = state.router.locationBeforeTransitions.query;
  const {
    plans,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing
  } = businessPlan || INIT_BUSINESS_PLAN_STATE;
  return {
    plans,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing,
    plan,
    period
  };
};

export default connect(mapStateToProps, mapActionCreators)(BusinessPlan);
