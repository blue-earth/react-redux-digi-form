import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';

const NEXT_STEP = 'NEXT_STEP';
const PREVIOUS_STEP = 'PREVIOUS_STEP';

export const SET_PLANS = 'SET_PLANS';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';
export const SET_SELECTED_PLAN_CONFIG = 'SET_SELECTED_PLAN_CONFIG';
export const SET_EMAIL = 'SET_EMAIL';

export const RECEIVE_VERIFY_SUBDOMAIN = 'RECEIVE_VERIFY_SUBDOMAIN';
export const RECEIVE_PURCHASE_RESULT = 'RECEIVE_PURCHASE_RESULT';

const REQUEST_PURCHASE_BUSINESS_PLAN = 'REQUEST_PURCHASE_BUSINESS_PLAN';
const DONE_FETCHING_PLANS = 'DONE_FETCHING_PLANS';
const DONE_PURCHASING_BUSINESS_PLAN = 'DONE_PURCHASING_BUSINESS_PLAN';

const DISPLAY_SUBDOMAIN_HINT = 'DISPLAY_SUBDOMAIN_HINT';

export const INIT_BUSINESS_PLAN_STATE = {
  stepIndex: 0,
  currentlySelectedPlan: {
    subdomain: ''
  },
  validations: {
    displaySubdomainHint: false,
    displaySubdomainVerified: false,
    isSubdomainVerified: false,
    subdomainErrorMessage: ''
  },
  email: '',
  paymentMethod: {
    cardNumber: '',
    expiry: '',
    cvc: ''
  },
  plansConfig: [],
  purchaseErrorMessage: '',
  isPageBusy: true
};

export const nextStep = createAction(NEXT_STEP);
export const previousStep = createAction(PREVIOUS_STEP);

export const setPaymentMethod = createAction(SET_PAYMENT_METHOD);
export const setEmail = createAction(SET_EMAIL);
export const setSelectedPlanConfig = createAction(SET_SELECTED_PLAN_CONFIG);

export const requestPurchaseBusinessPlan = createAction(REQUEST_PURCHASE_BUSINESS_PLAN);
export const doneFetchingPlans = createAction(DONE_FETCHING_PLANS);
export const donePurchasingBusinessPlan = createAction(DONE_PURCHASING_BUSINESS_PLAN);
export const receiveVerifySubdomain = createAction(RECEIVE_VERIFY_SUBDOMAIN);

export const displaySubdomainHint = createAction(DISPLAY_SUBDOMAIN_HINT);

export const changeSubdomain = (subdomain) => {
  return (dispatch, getState) => {
    dispatch(setSelectedPlanConfig({
      subdomain: subdomain
    }));
    dispatch(receiveVerifySubdomain({
      displaySubdomainVerified: false,
      isSubdomainVerified: false,
      subdomainErrorMessage: ''
    }));
    if (subdomain.length < 4) {
      dispatch(receiveVerifySubdomain({
        subdomainErrorMessage: 'Subdomain must be longer than four characters'
      }));
    }
  };
};
export const verifySubdomain = (subdomain) => {
  return (dispatch, getState) => {
    dispatch(processVerifySubdomain(subdomain));
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
export const fetchPlans = () => {
  return (dispatch, getState) => {
    const { plan, period } = getState().router.locationBeforeTransitions.query;
    dispatch(processFetchPlans(plan, period));
  };
};

export const purchasePlan = () => {
  return (dispatch, getState) => {
    const { currentlySelectedPlan, paymentMethod, email } = getState().businessPlan;
    const { subdomain, name, billingCycle, numberOfUsers } = currentlySelectedPlan;
    const { cardNumber, expiry, cvc } = paymentMethod;
    const plan = {
      subdomain: subdomain,
      name: name,
      number_of_users: numberOfUsers,
      billing_cycle: billingCycle,
      email: email,
      paymentMethod: {
        card_number: cardNumber,
        expiry: expiry,
        cvc: cvc
      }
    };
    dispatch(requestPurchaseBusinessPlan());
    dispatch(processPurchase(plan));
  };
};
const processFetchPlans = (plan, period) => {
  const apiURL = `${API_URL}/billing/api/plan/`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      dispatch(_setPlanInitialState(value, plan, period));
      dispatch(_setPlansConfig(value));
    };
  };
  const fetchFail = (data) => {
    console.log(data);
  };
  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};
const _setPlansConfig = (plans) => {
  const cameledPlans = plans.map((plan) =>
    Object.assign({}, {
      name: plan.name,
      priceCents: plan.price_cents,
      priceCurrency: plan.price_currency,
      minRequiredNumUser: plan.min_required_num_user,
      maxNumUser: plan.max_num_user
    }));
  return (dispatch, getState) => {
    dispatch(doneFetchingPlans(cameledPlans));
  };
};
const _setPlanInitialState = (plans, plan, period) => {
  return (dispatch, getState) => {
    for (let i in plans) {
      const planDetail = plans[i];
      if (planDetail.name === plan + '-' + period) {
        return dispatch(setSelectedPlanConfig({
          name: plan,
          numberOfUsers: planDetail.min_required_num_user,
          billingCycle: period
        }));
      }
    }
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
        displaySubdomainVerified: true,
        isSubdomainVerified: result,
        subdomainErrorMessage: error
      }));
    };
  };
  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(receiveVerifySubdomain({
        displaySubdomainVerified: true,
        isSubdomainVerified: false,
        subdomainErrorMessage: 'Service Error'
      }));
    };
  };
  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};

const processPurchase = (plan) => {
  const apiURL = `${API_URL}/accounts/api/subscription/`;
  const body = { plan };
  const fetchParams = assignDefaults({
    method: 'POST',
    body
  });

  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const {result, message} = value;
      if (result === 'rejected') {
        dispatch(donePurchasingBusinessPlan(message));
      }
    };
  };

  const fetchFail = (data) => {
    return (dispatch, getState) => {
      dispatch(donePurchasingBusinessPlan('Server Error'));
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
  REQUEST_PURCHASE_BUSINESS_PLAN: (state, action) =>
    Object.assign({}, state, {
      isPageBusy: true
    }),
  DONE_FETCHING_PLANS: (state, action) =>
    Object.assign({}, state, {
      plansConfig: action.payload,
      isPageBusy: false
    }),
  DONE_PURCHASING_BUSINESS_PLAN: (state, action) =>
    Object.assign({}, state, {
      purchaseErrorMessage: action.payload,
      isPageBusy: false
    }),
  SET_SELECTED_PLAN_CONFIG: (state, action) =>
    Object.assign({}, state, {
      currentlySelectedPlan: Object.assign({}, state.currentlySelectedPlan, { ...action.payload })
    }),
  SET_PLANS_CONFIG: (state, action) =>
    Object.assign({}, state, {
      plansConfig: action.payload
    }),
  SET_PAYMENT_METHOD: (state, action) =>
    Object.assign({}, state, {
      paymentMethod: Object.assign({}, state.paymentMethod, {...action.payload})
    }),
  SET_EMAIL: (state, action) =>
    Object.assign({}, state, {
      email: action.payload
    }),
  DISPLAY_SUBDOMAIN_HINT: (state, action) =>
    Object.assign({}, state, {
      validations: Object.assign({}, state.validations, {
        displaySubdomainHint: action.payload
      })
    })
}, INIT_BUSINESS_PLAN_STATE);

export default businessPlanReducer;
