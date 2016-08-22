import connect from 'redux/utils/connect';
import {
  purchasePlan,
  goToNextStep,
  fetchPlanDetail,
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
  fetchPlanDetail,
  verifySubdomain,
  setPlanConfig,
  setPaymentMethod
};

const mapStateToProps = (state) => {
  const { businessPlan } = state;
  const {
    detail,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing
  } = businessPlan || INIT_BUSINESS_PLAN_STATE;
  return {
    detail,
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing
  };
};

export default connect(mapStateToProps, mapActionCreators)(BusinessPlan);
