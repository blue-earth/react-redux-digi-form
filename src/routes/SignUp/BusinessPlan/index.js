import {injectReducer} from 'redux/reducers';

export default (store) => ({
  path: 'business-plan',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const reducer = require('redux/modules/businessPlan').default;
      injectReducer(store, {key: 'businessPlan', reducer});
      const BusinessPlan = require('./containers/BusinessPlanContainer').default;
      cb(null, BusinessPlan);
    }, 'businessPlan');
  }
});
