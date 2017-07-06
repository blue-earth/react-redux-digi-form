import connect from 'redux/utils/connect';
import { submitSignupForm, INIT_AUTH_STATE } from 'redux/modules/auth';
import { goTo } from 'redux/modules/router.js';
import SignUpFormView from '../components/SignUpFormView';
import { reduxForm } from 'redux-form';
import formSchema from '../schema';

const mapActionCreators = {
  submitSignupForm,
  goTo
};

const mapStateToProps = (state) => {
  const { auth } = state;
  const {
    authStatus,
    isAuthenticating,
    serverResponse
  } = auth || INIT_AUTH_STATE;
  return {
    authStatus,
    isAuthenticating,
    serverResponse
  };
};

const WrappedSignUpForm = connect(mapStateToProps, mapActionCreators)(SignUpFormView);

export default reduxForm({
  form: 'signUpForm',
  validate: formSchema.validate
})(WrappedSignUpForm);
