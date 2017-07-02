import React, {
  Component,
  PropTypes
} from 'react';
import { dashboardUrl, signupUrl } from 'helpers/urlHelper';
import Verifier from 'components/Verifier/Verifier';
import Button from 'components/Buttons/DashboardButtons/Button';
import {
  LOGGED_IN,
  NOT_LOGGED_IN
} from 'redux/modules/auth';
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
    authStatus: PropTypes.string.isRequired,
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
    const { authStatus, goTo } = props;
    if (authStatus === LOGGED_IN) {
      goTo(dashboardUrl(''));
    }
    if (props.authStatus === NOT_LOGGED_IN && this.props.authStatus !== props.authStatus) {
      this.setState({ password: '' });
    }
  }

  // https://medium.com/@dschmidt1992/auto-fill-with-redux-forms-9b51ad8ef962#.8ebh8tbg9
  componentDidMount() {
    const { email, password } = this.props.fields;
    email.onChange(this.refs.email.value);
    password.onChange(this.refs.password.value);
  }

  handleSubmit = () => {
    const { fields: {email, password}, authStatus, submitLoginForm } = this.props;
    if (email.dirty && password.dirty) {
      if (!email.error && !password.error && authStatus === NOT_LOGGED_IN) {
        this.setState({isSubmitting: true});
        submitLoginForm(email.value, password.value);
        this.setState({hasSubmitted: true, isSubmitting: false});
      }
    }
  }

  handleSignupClick = () => {
    const { goTo } = this.props;
    goTo(signupUrl(''));
  }

  handleKeyDown = (evt) => {
    const { fields: {email, password} } = this.props;
    if (evt.which === 13) {
      this.handleSubmit();
    }
  }

  renderVerificationStatus = () => {
    const { authStatus, isAuthenticating } = this.props;
    const { hasSubmitted, isSubmitting } = this.state;
    if (hasSubmitted && !isSubmitting && !isAuthenticating && authStatus !== 'LOGGING_IN') {
      return (<Verifier type="EmondoAuthenticationService" status={authStatus === LOGGED_IN} />);
    } else {
      return false;
    }
  }

  render() {
    const { fields: {email, password}, authStatus } = this.props;
    return (
      <div className={styles.loginFormWrapper} onKeyDown={this.handleKeyDown}>
        <Header />
        <div className={styles.inputWrapper}>
          <h2>Log in to your account</h2>
          <div className={'form-group' + (email.touched && email.error ? ' has-error':'')}>
            <input ref="email" type="text" placeholder="Email" className="form-control input-lg"
              {...domOnlyProps(email)} />
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
              isDisabled={typeof password.error !== 'undefined' || typeof email.error !== 'undefined'}
              isLoading={authStatus === 'LOGGING_IN'}>
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
