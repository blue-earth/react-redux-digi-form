import React, { Component, PropTypes } from 'react';
import { dashboardUrl, loginUrl } from 'helpers/urlHelper';
// import Verifier from 'components/Verifier/Verifier';
import { Grid, Row, Col } from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import {
  LOGGED_IN,
  NOT_LOGGED_IN,
  NOT_SIGNED_UP
} from 'redux/modules/auth';
import {
  FaGooglePlusSquare,
  FaFacebookSquare,
  FaLinkedinSquare
} from 'react-icons/lib/fa';
import Header from 'components/Headers/Header';
import styles from './SignUpFormView.scss';

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

class SignUpForm extends Component {

  static propTypes = {
    submitSignupForm: PropTypes.func.isRequired,
    authStatus: PropTypes.string.isRequired,
    goTo: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    serverResponse: PropTypes.object.isRequired,
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

  handleLoginClick = () => {
    const { goTo } = this.props;
    goTo(loginUrl(''));
  }

  handleSubmit = () => {
    const { fields: {email, password}, authStatus, submitSignupForm } = this.props;
    if (email.touched && password.touched) {
      if (!email.error && !password.error && (authStatus === NOT_LOGGED_IN || authStatus === NOT_SIGNED_UP)) {
        this.setState({isSubmitting: true});
        submitSignupForm(email.value, password.value);
        this.setState({hasSubmitted: true, isSubmitting: false});
      }
    }
  }

  renderVerificationStatus = () => {
    const { authStatus, isAuthenticating, serverResponse } = this.props;
    const { hasSubmitted, isSubmitting } = this.state;
    if (hasSubmitted && !isSubmitting && !isAuthenticating) {
      // form has been submitted
      if (authStatus === NOT_SIGNED_UP) {
        // there was an error
        // TODO: add a link to the email error for password retreival
        if (serverResponse.hasOwnProperty('email') && serverResponse.email[0] === 'Email address already exists') {
          return (<p className={styles.error}>Sorry, that email address is already in use.</p>);
        }
        return (<p className={styles.error}>There was a problem creating your account.</p>);
      } else {
        // currently the user should be logged in at this point
        // TODO: once email verification is implemented, add a message here saying an email has been sent
      }
    } else {
      return false;
    }
  }

  // TODO: pages for Terms and Privacy Policy
  // TODO: social signup
  render() {
    const { fields: {email, password}, authStatus } = this.props;
    return (
      <div>
        <Header />
        <Grid fluid>
          <div className={styles.signupWrapper}>
            <h2 className={styles.formTitle}>Join for Free</h2>
            <Row>
              <Col xs={12} sm={6}>
                <div className={styles.signupLeft}>
                  <div className={'form-group' + (email.touched && email.error ? ' has-error':'')}>
                    <input type="text" placeholder="Email" className="form-control input-lg"
                      {...domOnlyProps(email)} />
                    {email.touched && email.error && <div className="help-block">{email.error}</div>}
                  </div>
                  <div className={'form-group' + (password.touched && password.error ? ' has-error':'')}>
                    <input type="password" placeholder="Password" className="form-control input-lg"
                      {...domOnlyProps(password)} />
                  </div>
                  {this.renderVerificationStatus()}
                  <Button onClick={this.handleSubmit} className="btn-lg btn-block" style="submitButton"
                    isDisabled={typeof password.error !== 'undefined' || typeof email.error !== 'undefined'}
                    isLoading={authStatus === 'LOGGING_IN'}>
                    Create your emondo account
                  </Button>
                  <p>By continuing you agree to the <a>Terms &amp; Conditions</a> and <a>Privacy Policy</a></p>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className={styles.signupRight}>
                  <div className={styles.divider}><span className={styles.or}>OR</span></div>
                  <div className="form-group">
                    <Button className="btn-block" style="defaultButton">
                      <FaGooglePlusSquare /> Join with Google
                    </Button>
                  </div>
                  <div className="form-group">
                    <Button className="btn-block" style="defaultButton">
                      <FaFacebookSquare /> Join with Facebook
                    </Button>
                  </div>
                  <div className="form-group">
                    <Button className="btn-block" style="defaultButton">
                      <FaLinkedinSquare /> Join with Linkedin
                    </Button>
                  </div>
                  <p>Don&#39;t worry. We won&#39;t post anything without your permission.</p>
                </div>
              </Col>
            </Row>
            <p className={styles.loginLink}>
              Already an emondo member? <a onClick={this.handleLoginClick}><b>Log in</b></a>
            </p>
          </div>
        </Grid>
      </div>
    );
  }
}

export default SignUpForm;
