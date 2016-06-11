import React, { Component, PropTypes } from 'react';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import PasswordInput from 'components/QuestionInputs/PasswordInput/PasswordInput';
import Validator from 'components/Validator/Validator';
import Verifier from 'components/Verifier/Verifier';
import validateField from 'helpers/validationHelper';
import { Button } from 'react-bootstrap';
import { LOGGED_IN, NOT_LOGGED_IN } from 'redux/modules/auth';
import { FaGooglePlusSquare,FaFacebookSquare,FaLinkedinSquare} from 'react-icons/lib/fa';
// import FormSection from '../FormSection/FormSection';
// import FormRow from '../FormRow/FormRow';
// import { fetchFormIfNeeded, storeAnswer } from 'redux/modules/formInteractive';
// import { groupFormQuestions, SlideAnimation }
//   from 'helpers/formInteractiveHelper.js';
// import { findIndexById } from 'helpers/pureFunctions';
import Header from 'components/Header'
import styles from './LoginFormView.scss';
// import Animate from 'rc-animate';

class LoginForm extends Component {

  static propTypes = {
    submitLoginForm: PropTypes.func.isRequired,
    authStatus: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailInputStatus: 'init',
      passwordInputStatus: 'init'
    }
  };
  componentWillReceiveProps(props) {
    const { authStatus } = props;
    if ( authStatus === LOGGED_IN ) {
      this.context.router.push('/forms')
    }
  }

  handleEmailChange = (value) => {
    this.setState({
      email: value,
      emailInputStatus: 'changing'
    });
  }

  handlePasswordChange = (value) => {
    this.setState({
      password: value,
      passwordInputStatus: 'changing'
    });
  }

  handleClick = () => {
    const { submitLoginForm } = this.props;
    const { email, password, emailInputStatus, passwordInputStatus } = this.state;
    var isEmailValid = validateField({type:'isEmail'}, email);
    var isPasswordValid = validateField({type:'isRequired'}, password);

    if (isEmailValid && isPasswordValid) {
      this.setState({
        emailInputStatus: 'validated',
        passwordInputStatus: 'validated'
      })
      submitLoginForm(email, password)
    } else {
      this.setState({
        emailInputStatus: isEmailValid ? emailInputStatus : 'failed',
        passwordInputStatus: isPasswordValid ? passwordInputStatus : 'failed'
      })
    }
  }
  render() {
    const { email, password, emailInputStatus, passwordInputStatus } = this.state;
    const { authStatus } = this.props;
    const showVerificationStatus = emailInputStatus === 'validated' && 
      passwordInputStatus === 'validated' && authStatus === NOT_LOGGED_IN;
    return (

      <div className={styles.loginFormWrapper}>
        <Header />
        <div className={styles.inputWrapper}>
          <h2>LOG IN</h2>
          {emailInputStatus === 'failed' &&
            <Validator type="isEmail" validateFor={email} />
          }
          <ShortTextInput type="EmailField" placeholderText="Email" value={email} onChange={this.handleEmailChange} />
          <div className={styles.splitter}></div>
          <PasswordInput type="password" placeholderText="Password" value={password} onChange={this.handlePasswordChange} />
          {passwordInputStatus === 'failed' &&
            <Validator type="isRequired" validateFor={password} />
          }
          {showVerificationStatus &&
            <Verifier type="EmondoAuthenticationService" status={authStatus === LOGGED_IN} />
          }
          <div className={styles.submitButtonWrapper}>
            <Button onClick={this.handleClick} bsStyle={ null } className={styles.btn_submit}><l>PRESS</l><br/>ENTER</Button>
          </div>
          <h3>Forgot your password?</h3>
          <h4>Log in with:</h4>
          <div className={styles.socialIconArea}>
            <FaGooglePlusSquare size="45"/>
            <FaFacebookSquare size="45"/>
            <FaLinkedinSquare size="45"/>
          </div>
          <h5>or <l>join for free</l></h5>
        </div>
      </div>
    )
  }
  
}

export default LoginForm;
