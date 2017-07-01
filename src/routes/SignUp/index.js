export default (store) => ({
  path: 'signup',
  getIndexRoute(location, cb) {
    // do something async here
    const SignUpForm = require('./containers/SignUpFormContainer').default;
    cb(null, {component: SignUpForm});
  }
});
