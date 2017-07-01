import { signupPath } from 'helpers/urlHelper';
import BusinessPlanRoute from './BusinessPlan';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export default (store) => ({
  path: signupPath,
  childRoutes: [
    BusinessPlanRoute(store)
  ],
  getIndexRoute(location, cb) {
    // do something async here
    const SignUpForm = require('./containers/SignUpFormContainer').default;
    cb(null, {component: SignUpForm});
  }
});
