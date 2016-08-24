import connect from 'redux/utils/connect';
import { submitLoginForm, INIT_AUTH_STATE } from 'redux/modules/auth';
import { goTo } from 'redux/modules/router.js';
import LoginFormView from '../components/LoginFormView';
import { reduxForm } from 'redux-form';
import formSchema from '../schema';
// console.log(formSchema);

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

// const validate = (values) => {
//   const errors = {};
//   if (!values.email) {
//     errors.email = 'Required';
//   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//     errors.email = 'Invalid email address';
//   }
//   if (!values.password) {
//     errors.password = 'Required';
//   }
//   return errors;
// };

// export default connect(mapStateToProps, mapActionCreators)(LoginFormView);

const WrappedLoginForm = connect(mapStateToProps, mapActionCreators)(LoginFormView);

export default reduxForm({
  form: 'loginForm',
  // fields: ['email', 'password'],
  fields: formSchema.fields,
  validate: formSchema.validate
})(WrappedLoginForm);
