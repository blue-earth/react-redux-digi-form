import connect from 'redux/utils/connect';
import {
  purchasePlan,
  goToNextStep,
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
  verifySubdomain,
  setPlanConfig,
  setPaymentMethod
};

const mapStateToProps = (state) => {
  const { businessPlan } = state;
  const {
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing
  } = businessPlan || INIT_BUSINESS_PLAN_STATE;
  return {
    stepIndex,
    planConfig,
    validations,
    paymentMethod,
    purchaseErrorMessage,
    isPurchasing
  };
};

export default connect(mapStateToProps, mapActionCreators)(BusinessPlan);
