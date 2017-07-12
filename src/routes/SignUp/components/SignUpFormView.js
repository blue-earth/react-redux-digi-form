import React, { Component, PropTypes } from 'react';
import { dashboardUrl, loginUrl } from 'helpers/urlHelper';
// import Verifier from 'components/Verifier/Verifier';
import { Form, Grid, Row, Col } from 'react-bootstrap';
import { Field } from 'redux-form';
import classNames from 'classnames';
import Button from 'components/Buttons/DashboardButtons/Button';
import {
  LOGGED_IN,
  NOT_SIGNED_UP
} from 'redux/modules/auth';
import {
  FaGooglePlusSquare,
  FaFacebookSquare,
  FaLinkedinSquare
} from 'react-icons/lib/fa';
import Header from 'components/Headers/Header';
import styles from './SignUpFormView.scss';

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

class SignUpForm extends Component {

  static propTypes = {
    submitSignupForm: PropTypes.func.isRequired,
    processLogout: PropTypes.func,
    authStatus: PropTypes.string.isRequired,
    goTo: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    serverResponse: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  componentWillMount() {
    this.props.processLogout();
  }

  componentWillReceiveProps(props) {
    const { authStatus, goTo } = props;
    if (authStatus === LOGGED_IN) {
      goTo(dashboardUrl(''));
    }
  }

  handleLoginClick = () => {
    const { goTo } = this.props;
    goTo(loginUrl(''));
  }

  handleSignup = (values) => {
    const { email, password } = values;
    const { submitSignupForm } = this.props;
    submitSignupForm(email, password);
  }

  get isNotSignedUp() {
    const { authStatus } = this.props;
    return authStatus === NOT_SIGNED_UP;
  }

  renderVerificationStatus = () => {
    const { isAuthenticating, serverResponse, pristine, submitting } = this.props;
    if (!pristine && !submitting && !isAuthenticating) {
      // form has been submitted
      if (this.isNotSignedUp) {
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
    const { pristine, submitting, handleSubmit } = this.props;
    return (
      <div>
        <Header />
        <Grid fluid>
          <div className={styles.signupWrapper}>
            <h2 className={styles.formTitle}>Join for Free</h2>
            <Row>
              <Col xs={12} sm={6} smPush={3}>
                <Form className={styles.signupLeft} onSubmit={handleSubmit(this.handleSignup)}>
                  <Field name="email" component={renderInput} type="email" placeholder="Email" autoFocus />
                  <Field name="password" component={renderInput} type="password" placeholder="Password" />
                  {this.renderVerificationStatus()}
                  <Button onClick={handleSubmit(this.handleSignup)}
                    className="btn-lg btn-block" style="submitButton" type="submit"
                    isDisabled={pristine || submitting}
                    isLoading={submitting}>
                    Create your emondo account
                  </Button>
                  <p>By continuing you agree to the <a>Terms &amp; Conditions</a> and <a>Privacy Policy</a></p>
                </Form>
              </Col>
              <Col xs={12} sm={6} className={styles.socialLogin}>
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
