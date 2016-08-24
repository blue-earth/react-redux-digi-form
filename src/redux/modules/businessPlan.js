import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';
import { assignDefaults } from 'redux/utils/request';
import { createAction, handleActions } from 'redux-actions';
import { camelize, decamelize } from 'humps';

export const NEXT_STEP = 'NEXT_STEP';
export const PREVIOUS_STEP = 'PREVIOUS_STEP';

export const SET_PLANS = 'SET_PLANS';
export const SET_PAYMENT_METHOD = 'SET_PAYMENT_METHOD';
export const SET_PLAN_CONFIG = 'SET_PLAN_CONFIG';
export const SET_IS_PURCHASING = 'SET_IS_PURCHASING';

export const RECEIVE_VERIFY_SUBDOMAIN = 'RECEIVE_VERIFY_SUBDOMAIN';
export const RECEIVE_PURCHASE_RESULT = 'RECEIVE_PURCHASE_RESULT';

export const INIT_BUSINESS_PLAN_STATE = {
  stepIndex: 0,
  plans: [{
    name: 'global-annually',
    price_cents: 9983,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: null
  }, {
    name: 'global-monthly',
    price_cents: 14900,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: null
  }, {
    name: 'teams-annually',
    price_cents: 5293,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: null
  }, {
    name: 'teams-monthly',
    price_cents: 7900,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: null
  }, {
    name: 'professional-annually',
    price_cents: 2613,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: 20
  }, {
    name: 'professional-monthly',
    price_cents: 3900,
    price_currency: 'AUD',
    min_required_num_user: 1,
    max_num_user: null
  }],
  planConfig: {
    name: 'teams',
    subdomain: '',
    numberOfUsers: 1,
    billingCycle: 'annually'
  },
  validations: {
    isSubdomainVerified: false,
    subdomainErrorMessage: ''
  },
  paymentMethod: {
    email: '',
    cardNumber: '',
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
export const setPlans = createAction(SET_PLANS);
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
    } else {
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
export const fetchPlans = () => {
  return (dispatch, getState) => {
    const { plan, period } = getState().router.locationBeforeTransitions.query;
    dispatch(processFetchPlans(plan, period));
  };
};

export const purchasePlan = () => {
  return (dispatch, getState) => {
    const { planConfig, paymentMethod } = getState().businessPlan;
    const businessPlan = {
      planConfig: Object.assign({},
        ...Object.keys(planConfig).map(key => ({
          [decamelize(key)]: planConfig[key]
        }))
      ),
      paymentMethod: Object.assign({},
        ...Object.keys(paymentMethod).map(key => ({
          [decamelize(key)]: paymentMethod[key]
        }))
      )
    };
    dispatch(setIsPurchasing(true));
    dispatch(processPurchase(businessPlan));
  };
};
const processFetchPlans = (plan, period) => {
  const apiURL = `${API_URL}/billing/api/plan/`;
  const fetchParams = assignDefaults({
    method: 'GET'
  });
  const fetchSuccess = ({value}) => {
    return (dispatch, getState) => {
      const newPlan = value.map(item => Object.assign({},
        ...Object.keys(item).map(key => ({
          [camelize(key)]: item[key]
        }))));
      dispatch(setPlans(newPlan));
      dispatch(_setPlanConfig(value, plan, period));
    };
  };
  const fetchFail = (data) => {
    console.log(data);
  };
  return bind(fetch(apiURL, fetchParams), fetchSuccess, fetchFail);
};
const _setPlanConfig = (plans, plan, period) => {
  return (dispatch, getState) => {
    for (let i in plans) {
      const planDetail = plans[i];
      if (planDetail.name === plan + '-' + period) {
        return dispatch(setPlanConfig({
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
  SET_PLANS: (state, action) =>
    Object.assign({}, state, {
      plans: action.payload
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
