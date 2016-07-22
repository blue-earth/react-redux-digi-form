export default (store) => ({
  path: 'login',
  getIndexRoute(location, cb) {
    // do something async here
    const LoginForm = require('./containers/LoginFormContainer').default;
    cb(null, {component: LoginForm});
  }
});
