import connect from 'redux/utils/connect';
import { submitLoginForm, INIT_AUTH_STATE } from 'redux/modules/auth';
import { goTo } from 'redux/modules/router.js';
import LoginFormView from '../components/LoginFormView';
import { reduxForm } from 'redux-form';
import formSchema from '../schema';

const mapActionCreators = {
  submitLoginForm,
  goTo
};

const mapStateToProps = (state) => {
  const { auth } = state;
  const {
    authStatus,
    isAuthenticating
  } = auth || INIT_AUTH_STATE;
  return {
    authStatus,
    isAuthenticating
  };
};

const WrappedLoginForm = connect(mapStateToProps, mapActionCreators)(LoginFormView);

export default reduxForm({
  form: 'loginForm',
  validate: formSchema.validate
})(WrappedLoginForm);
