import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

export const NEXT_STEP = 'NEXT_STEP';
export const PREVIOUS_STEP = 'PREVIOUS_STEP';

export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';
export const SET_PLAN_CONFIG = 'SET_PLAN_CONFIG';
export const SET_IS_PURCHASING = 'SET_IS_PURCHASING';

export const RECEIVE_VERIFY_SUBDOMAIN = 'RECEIVE_VERIFY_SUBDOMAIN';
export const RECEIVE_PURCHASE_RESULT = 'RECEIVE_PURCHASE_RESULT';

export const INIT_BUSINESS_PLAN_STATE = {
  stepIndex: 0,
  planConfig: {
    subdomain: '',
    number_of_users: 1,
    billing_cycle: 'annually'
  },
  validations: {
    isSubdomainVerified: false,
    subdomainErrorMessage: ''
  },
  paymentMethod: {
    email: '',
    card_number: '',
    expiry: '',
    cvc: ''
  },
  purchaseErrorMessage: '',
  isPurchasing: false
};

export const nextStep = createAction(NEXT_STEP);
export const previousStep = createAction(PREVIOUS_STEP);
export const setPlanConfig = createAction(SET_PLAN_CONFIG);
export const setPaymentMethod = createAction(SET_PAYMENT_METHOD);
export const receiveVerifySubdomain = createAction(RECEIVE_VERIFY_SUBDOMAIN);
export const receivePurchaseResult = createAction(RECEIVE_PURCHASE_RESULT);
export const setIsPurchasing = createAction(SET_IS_PURCHASING);

export const verifySubdomain = (subdomain) => {
  return (dispatch, getState) => {
    if (subdomain.length < 4) {
      dispatch(receiveVerifySubdomain({
        isSubdomainVerified: false,
        subdomainErrorMessage: 'Subdomain must be longer than four characters'
      }));
    }
    else {
      dispatch(processVerifySubdomain(subdomain));      
    }
  };
};

export const goToNextStep = () => {
  return (dispatch, getState) => {
    dispatch(nextStep());
  };
};

export const goToPreviousStep = () => {
  return (dispatch, getState) => {
    dispatch(previousStep());
  };
};

export const purchasePlan = () => {
  return (dispatch, getState) => {
    const { planConfig, paymentMethod } = getState().businessPlan;
    dispatch(setIsPurchasing(true));
    dispatch(processPurchase({ planConfig, paymentMethod }));
  };
};

const processVerifySubdomain = (subdomain) => {
  const apiURL = `${API_URL}/accounts/api/subdomain/verify/`;
  const body = {subdomain};
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const {result, error} = value;
      dispatch(receiveVerifySubdomain({
        isSubdomainVerified: result,
        subdomainErrorMessage: error
      }));
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      console.log(data);
    };
  };
  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

const processPurchase = (businessPlan) => {
  const apiURL = `${API_URL}/accounts/api/subscription/`;
  const body = { businessPlan };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(setIsPurchasing(false));
      const {result, message} = value;
      if (result === 'rejected') {
        dispatch(receivePurchaseResult(message));
      }
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(setIsPurchasing(false));
      dispatch(receivePurchaseResult('Server Error'));
      console.log(data);
    };
  };

  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

// ------------------------------------
// Reducer
// ------------------------------------
const businessPlanReducer = handleActions({
  NEXT_STEP: (state, action) =>
    Object.assign({}, state, {
      stepIndex: 1
    }),
  PREVIOUS_STEP: (state, action) =>
    Object.assign({}, state, {
      stepIndex: 0
    }),
  RECEIVE_VERIFY_SUBDOMAIN: (state, action) =>
    Object.assign({}, state, {
      validations: Object.assign({}, state.validations, {...action.payload})
    }),
  RECEIVE_PURCHASE_RESULT: (state, action) =>
    Object.assign({}, state, {
      purchaseErrorMessage: action.payload
    }),
  SET_PLAN_CONFIG: (state, action) =>
    Object.assign({}, state, {
      planConfig: Object.assign({}, state.planConfig, {...action.payload})
    }),
  SET_PAYMENT_METHOD: (state, action) =>
    Object.assign({}, state, {
      paymentMethod: Object.assign({}, state.paymentMethod, {...action.payload})
    }),
  SET_IS_PURCHASING: (state, action) =>
    Object.assign({}, state, {
      isPurchasing: action.payload
    })
}, INIT_BUSINESS_PLAN_STATE);

export default businessPlanReducer;
