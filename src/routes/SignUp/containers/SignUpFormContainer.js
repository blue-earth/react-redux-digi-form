import connect from 'redux/utils/connect';
import { submitLoginForm, INIT_AUTH_STATE } from 'redux/modules/auth';
import { goTo } from 'redux/modules/router.js';
import SignUpFormView from '../components/SignUpFormView';
import { reduxForm } from 'redux-form';
import formSchema from '../schema';
// TODO: this has all been copied from login form, needs updating once a reducer exists
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

const WrappedSignUpForm = connect(mapStateToProps, mapActionCreators)(SignUpFormView);

export default reduxForm({
  form: 'signUpForm',
  fields: formSchema.fields,
  validate: formSchema.validate
})(WrappedSignUpForm);
