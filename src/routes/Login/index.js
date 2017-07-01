import { loginUrl } from 'helpers/urlHelper';

export default (store) => ({
  path: loginUrl(),
  getIndexRoute(location, cb) {
    // do something async here
    const LoginForm = require('./containers/LoginFormContainer').default;
    cb(null, {component: LoginForm});
  }
});
