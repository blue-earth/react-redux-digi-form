import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import FormEnterButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import AppButton from 'components/Buttons/AppButton/AppButton';
import SignatureWidget from 'components/SignatureWidget/SignatureWidget';
import VerificationWidget from 'components/SignatureWidget/VerificationWidget';
import styles from './SignatureQuestion.scss';
import { signatureFonts } from 'schemas/signatureSchema';
import { valueIsValid } from 'helpers/validationHelper';

class SignatureQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    showModal: PropTypes.func,
    handleEnter: PropTypes.func,
    formTitle: PropTypes.string,

    // flag to determine if widgets should be displayed in modals
    useModal: PropTypes.bool,

    // email verification props
    isPageBusy: PropTypes.bool,
    verificationWidgetIsActive: PropTypes.bool,
    isCodeVerified: PropTypes.bool,
    hasCodeVerified: PropTypes.bool,
    verifyEmailCode: PropTypes.func,
    requestVerificationCode: PropTypes.func,
    resetCodeVerified: PropTypes.func,
    submitValue: PropTypes.func.isRequired,
    closeVerificationModal: PropTypes.func.isRequired
  };

  static defaultProps = {
    isReadOnly: false,
    value: {'name': '', 'email': '', 'dataUrl': ''},
    useModal: true
  };

  constructor(props) {
    super(props);
    this.state = {
      signatureWidgetIsActive: false,
      errors: {'name': [], 'email': [], 'dataUrl': []}
    };
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
  }

  showSignatureWidget = () => {
    this.setState({signatureWidgetIsActive: true});
  }
  hideSignatureWidget = () => {
    this.setState({signatureWidgetIsActive: false});
  }

  resetErrors = (key=false) => {
    var newErrors = this.state.errors;
    if (key) {
      newErrors[key] = [];
    } else {
      newErrors = {'name': [], 'email': [], 'dataUrl': []};
    }
    this.setState({
      errors: newErrors
    });
  }

  focusSignatureImage() {
    const { autoFocus } = this.props;
    const signatureImage = this.refs.signatureImage;
    if (autoFocus && signatureImage) {
      setTimeout(function () {
        signatureImage.focus();
      }, 50);
    }
  }

  handleChange = (value) => {
    this.resetErrors();
    this.props.onChange(value);
    // this.hideSignatureWidget();
    // this.setState({shouldValidate: true});
    var errors = this.state.errors;
    let isValid = true;
    // Empty signature error handle
    if (value.dataUrl === '') {
      errors.dataUrl = ['Please sign your signature.'];
      isValid = false;
    }
    var emailErrors = valueIsValid(value.email, [{'type': 'isEmail'}]);
    if (emailErrors.length > 0) {
      errors.email = emailErrors;
      isValid = false;
    }
    // Empty signature name error handle
    var nameErrors = valueIsValid(value.name, [{'type': 'isRequired'}]);
    if (nameErrors.length > 0) {
      errors.name = nameErrors;
      isValid = false;
    }
    if (isValid) {
      this.hideSignatureWidget();
      // TODO: trigger verification
      this.props.submitValue(value);
    } else {
      this.setState({errors: errors});
      this.showSignatureWidget();
    }
  }

  handleKeyDown = (event) => {
    const { handleEnter } = this.props;
    if (event.keyCode === 13) {
      handleEnter();
    }
  }

  render() {
    const { value, isReadOnly, isPageBusy, autoFocus, useModal, verificationWidgetIsActive } = this.props;
    const { signatureWidgetIsActive } = this.state;
    const preloadFonts = signatureFonts.map((font, index) => (
      <div className={`signature-font-preload preload-${font.name}`} key={index}>font</div>
    ));
    const that = this;
    return (
      <div className={styles.signature}>
        {(useModal || (!useModal && !signatureWidgetIsActive && !verificationWidgetIsActive)) && value.dataUrl &&
          <div>
            <img src={value.dataUrl} alt="signature"
              className={styles.signatureImage}
              ref="signatureImage"
              tabIndex={0} onKeyDown={this.handleKeyDown}
            />
            <AppButton
              isDisabled={isPageBusy}
              size="lg"
              autoFocus={!value.dataUrl && autoFocus}
              onClick={that.showSignatureWidget}>
              Re-sign
            </AppButton>
          </div>
        }
        {(useModal || (!useModal && !signatureWidgetIsActive && !verificationWidgetIsActive)) &&
          !isReadOnly && !value.dataUrl &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isPageBusy}
            autoFocus={!value.dataUrl && autoFocus}
            onClick={that.showSignatureWidget} />
        }
        {!useModal && signatureWidgetIsActive &&
          <SignatureWidget
            value={this.props.value}
            errors={this.state.errors}
            resetErrors={this.resetErrors}
            formTitle={this.props.formTitle}
            onChange={this.handleChange}
            isPageBusy={this.props.isPageBusy}
            closeWidget={this.hideSignatureWidget}
          />
        }
        {!useModal && verificationWidgetIsActive &&
          <VerificationWidget
            isPageBusy={this.props.isPageBusy}
            hasCodeVerified={this.props.hasCodeVerified}
            hasError={!this.props.isCodeVerified}
            verifyEmailCode={this.props.verifyEmailCode}
            resendCode={this.props.requestVerificationCode}
            resetCodeVerified={this.props.resetCodeVerified}
            commitValue={this.props.value}
            closeWidget={this.props.closeVerificationModal}
          />
        }
        {useModal &&
          <Modal show={signatureWidgetIsActive} onHide={that.hideSignatureWidget}>
            <Modal.Header>
              <Modal.Title>YOUR SIGNATURE</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SignatureWidget
                value={this.props.value}
                errors={this.state.errors}
                resetErrors={this.resetErrors}
                formTitle={this.props.formTitle}
                onChange={this.handleChange}
                isPageBusy={this.props.isPageBusy}
                closeWidget={this.hideSignatureWidget}
              />
            </Modal.Body>
          </Modal>
        }
        {useModal &&
          <Modal show={verificationWidgetIsActive}>
            <Modal.Body>
              <VerificationWidget
                isPageBusy={this.props.isPageBusy}
                hasCodeVerified={this.props.hasCodeVerified}
                hasError={!this.props.isCodeVerified}
                verifyEmailCode={this.props.verifyEmailCode}
                resendCode={this.props.requestVerificationCode}
                resetCodeVerified={this.props.resetCodeVerified}
                commitValue={this.props.value}
                closeWidget={this.props.closeVerificationModal}
              />
            </Modal.Body>
          </Modal>
        }
        {preloadFonts}
      </div>
    );
  }
}

export default SignatureQuestion;
