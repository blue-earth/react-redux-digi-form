import React, {
  Component,
  PropTypes
} from 'react';
import { Field } from 'redux-form';
import { Form } from 'react-bootstrap';
import classNames from 'classnames';
import { dashboardUrl, signupUrl } from 'helpers/urlHelper';
import { LOGIN_FAILED } from 'redux/modules/auth';
import Verifier from 'components/Verifier/Verifier';
import Button from 'components/Buttons/DashboardButtons/Button';

// import {
//   FaGooglePlusSquare,
//   FaFacebookSquare,
//   FaLinkedinSquare
// } from 'react-icons/lib/fa';
import Header from 'components/Headers/Header';
import styles from './LoginFormView.scss';

const renderInput = field => (
  <div className={classNames({
    'form-group': true,
    'has-error': field.meta.touched && field.meta.error
  })}>
    <input {...field.input} placeholder={field.placeholder} type={field.type}
      className="form-control input-lg" autoFocus={field.autoFocus} />
    {field.meta.touched && field.meta.error &&
      <div className="help-block">{field.meta.error}</div>
    }
  </div>
);

class LoginForm extends Component {

  static propTypes = {
    submitLoginForm: PropTypes.func.isRequired,
    authStatus: PropTypes.string,
    user: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  componentWillReceiveProps(props) {
    const { user, goTo } = props;
    if (Object.keys(user).length > 0) {
      goTo(dashboardUrl(''));
    }
  }

  handleLogin = (values) => {
    const { email, password } = values;
    const { submitLoginForm } = this.props;
    submitLoginForm(email, password);
  }

  handleSignupClick = () => {
    const { goTo } = this.props;
    goTo(signupUrl(''));
  }

  get loginFailed() {
    const { authStatus } = this.props;
    return authStatus === LOGIN_FAILED;
  }

  // TODO: a server response would be more usefull here, eg. "username not found" or "incorrect passsword"
  renderVerificationStatus = () => {
    if (this.loginFailed) {
      return (<Verifier type="EmondoAuthenticationService" status={false} />);
    } else {
      return false;
    }
  }

  render() {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <div className={styles.loginFormWrapper}>
        <Header />
        <Form onSubmit={handleSubmit(this.handleLogin)} className={styles.inputWrapper}>
          <h2>Log in to your account</h2>
          <Field name="email" component={renderInput} type="email" placeholder="Email" autoFocus />
          <Field name="password" component={renderInput} type="password" placeholder="Password" />

          {this.renderVerificationStatus()}
          <div className={styles.submitButtonWrapper}>
            <Button className="btn-lg btn-block" style="submitButton" type="submit"
              isDisabled={pristine || submitting}
              onClick={handleSubmit(this.handleLogin)}
              isLoading={submitting}>
              Login
            </Button>
          </div>
          <p>Dont have an account yet? <a onClick={this.handleSignupClick}>Join for free</a></p>
        </Form>
      </div>
    );
    // Old render with password link and social icons
    // which need to be put back when these features exist.
    // Some bits removed for brevity.
    // return (
    //   <div className={styles.loginFormWrapper}>
    //     <Header />
    //     <div className={styles.inputWrapper}>
    //       <h2>Log in to your account</h2>
    //       {this.renderVerificationStatus()}
    //       <div className={styles.submitButtonWrapper}>
    //         <Button onClick={this.handleSubmit} className="btn-lg btn-block" style="submitButton"
    //           isDisabled={typeof password.error !== 'undefined' || typeof email.error !== 'undefined'}
    //           isLoading={authStatus === 'LOGGING_IN'}>
    //           Login
    //         </Button>
    //       </div>
    //       <p className={styles.forgotPass}><a>Forgot your password?</a></p>
    //       <h4>Log in with:</h4>
    //       <div className={styles.socialIconArea}>
    //         <FaGooglePlusSquare size="45" />
    //         <FaFacebookSquare size="45" />
    //         <FaLinkedinSquare size="45" />
    //       </div>
    //       <p>or <a>join for free</a></p>
    //     </div>
    //   </div>
    // );
  }
}

export default LoginForm;
