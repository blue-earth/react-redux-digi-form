import React, {
  Component,
  PropTypes
} from 'react';
import { dashboardUrl, signupUrl } from 'helpers/urlHelper';
import Verifier from 'components/Verifier/Verifier';
import Button from 'components/Buttons/DashboardButtons/Button';
// import {
//   FaGooglePlusSquare,
//   FaFacebookSquare,
//   FaLinkedinSquare
// } from 'react-icons/lib/fa';
import Header from 'components/Headers/Header';
import styles from './LoginFormView.scss';

const domOnlyProps = ({
  initialValue,
  autofill,
  onUpdate,
  valid,
  invalid,
  dirty,
  pristine,
  active,
  touched,
  visited,
  autofilled,
  error,
  ...domProps }) => domProps;

class LoginForm extends Component {

  static propTypes = {
    submitLoginForm: PropTypes.func.isRequired,
    authStatus: PropTypes.string,
    user: PropTypes.object.isRequired,
    goTo: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      hasSubmitted: false,
      isSubmitting: false
    };
  }

  componentWillReceiveProps(props) {
    const { user, goTo } = props;
    if (Object.keys(user).length > 0) {
      goTo(dashboardUrl(''));
    }
  }

  handleSubmit = () => {
    const { fields: {email, password}, submitLoginForm } = this.props;
    const { isSubmitting } = this.state;
    if (!isSubmitting && email.dirty) {
      if (!email.error) {
        this.setState({isSubmitting: true});
        // the timeout is here to ensure that the password value is
        // visible in Chrome after the button or enter key is clicked
        // https://bugs.chromium.org/p/chromium/issues/detail?id=636425
        setTimeout(() => {
          // this is supposed to updated the field.password prop, but doesn't
          // password.onChange(this.refs.password.value);
          password.value = this.refs.password.value;
          // console.log('refs: ' + this.refs.password.value + ' | props: ' + password.value);
          submitLoginForm(email.value, password.value);
          this.setState({hasSubmitted: true, isSubmitting: false});
        }, 200);
      }
    }
  }

  handleSignupClick = () => {
    const { goTo } = this.props;
    goTo(signupUrl(''));
  }

  handleKeyDown = (evt) => {
    if (evt.which === 13) {
      this.handleSubmit();
    }
  }

  // TODO: a server response would be more usefull here, eg. "username not found" or "incorrect passsword"
  renderVerificationStatus = () => {
    const { isAuthenticating, user } = this.props;
    const { hasSubmitted, isSubmitting } = this.state;
    if (hasSubmitted && !isSubmitting && !isAuthenticating && Object.keys(user).length === 0) {
      return (<Verifier type="EmondoAuthenticationService" status={false} />);
    } else {
      return false;
    }
  }

  render() {
    const { fields: {email, password} } = this.props;
    return (
      <div className={styles.loginFormWrapper} onKeyDown={this.handleKeyDown}>
        <Header />
        <div className={styles.inputWrapper}>
          <h2>Log in to your account</h2>
          <div className={'form-group' + (email.touched && email.error ? ' has-error':'')}>
            <input ref="email" type="text" placeholder="Email" className="form-control input-lg"
              autoFocus {...domOnlyProps(email)} />
            {email.touched && email.error && <div className="help-block">{email.error}</div>}
          </div>
          <div className={'form-group' + (password.touched && password.error ? ' has-error':'')}>
            <input ref="password" type="password" placeholder="Password" className="form-control input-lg"
              {...domOnlyProps(password)} />
            {password.touched && password.error && <div className="help-block">{password.error}</div>}
          </div>
          {this.renderVerificationStatus()}
          <div className={styles.submitButtonWrapper}>
            <Button onClick={this.handleSubmit} className="btn-lg btn-block" style="submitButton"
              isDisabled={typeof email.error !== 'undefined'}
              isLoading={this.state.isSubmitting}>
              Login
            </Button>
          </div>
          <p>Dont have an account yet? <a onClick={this.handleSignupClick}>Join for free</a></p>
        </div>
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
