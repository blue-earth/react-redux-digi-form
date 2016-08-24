import React, {
  Component,
  PropTypes
} from 'react';
import { dashboardUrl } from 'helpers/urlHelper';
import Verifier from 'components/Verifier/Verifier';
import Button from 'components/Buttons/DashboardButtons/Button';
import {
  LOGGED_IN,
  NOT_LOGGED_IN
} from 'redux/modules/auth';
import {
  FaGooglePlusSquare,
  FaFacebookSquare,
  FaLinkedinSquare
} from 'react-icons/lib/fa';
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

  handleSubmit = () => {
    const { fields: {email, password}, authStatus, submitLoginForm } = this.props;
    if (email.touched && password.touched) {
      if (!email.error && !password.error && authStatus === NOT_LOGGED_IN) {
        this.setState({isSubmitting: true});
        submitLoginForm(email.value, password.value);
        this.setState({hasSubmitted: true, isSubmitting: false});
      }
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
      <div className={styles.loginFormWrapper}>
        <Header />
        <div className={styles.inputWrapper}>
          <h2>Login to your account</h2>
          <div className={'form-group' + (email.touched && email.error ? ' has-error':'')}>
            <input type="text" placeholder="Email" className="form-control input-lg"
              {...domOnlyProps(email)} />
            {email.touched && email.error && <div className="help-block">{email.error}</div>}
          </div>
          <div className={'form-group' + (password.touched && password.error ? ' has-error':'')}>
            <input type="password" placeholder="Password" className="form-control input-lg"
              {...domOnlyProps(password)} />
            {password.touched && password.error && <div className="help-block">{password.error}</div>}
          </div>
          {this.renderVerificationStatus()}
          <div className={styles.submitButtonWrapper}>
            <Button onClick={this.handleSubmit} className="btn-lg btn-block" style="submitButton"
              isDisabled={typeof password.error !== 'undefined' || typeof email.error !== 'undefined'}
              isLoading={authStatus === 'LOGGING_IN'}
              spinnerStyle="replaceAll" spinnerForeground="white" spinnerBackground="blue">
              Login
            </Button>
          </div>
          <h3>Forgot your password?</h3>
          <h4>Log in with:</h4>
          <div className={styles.socialIconArea}>
            <FaGooglePlusSquare size="45" />
            <FaFacebookSquare size="45" />
            <FaLinkedinSquare size="45" />
          </div>
          <h5>or <l>join for free</l></h5>
        </div>
      </div>
    );
  }
}

export default LoginForm;
