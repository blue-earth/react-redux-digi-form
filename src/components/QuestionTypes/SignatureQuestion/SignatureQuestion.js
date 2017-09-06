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
import styles from './SignatureQuestion.scss';
import { signatureFonts } from 'schemas/signatureSchema';
import { valueIsValid } from 'helpers/validationHelper';

class SignatureQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isInputLocked: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    showModal: PropTypes.func,
    handleEnter: PropTypes.func,
    formTitle: PropTypes.string
  };

  static defaultProps = {
    isInputLocked: false,
    isReadOnly: false,
    value: {'name': '', 'email': '', 'dataUrl': ''}
  };

  constructor(props) {
    super(props);
    this.state = {
      showSignatureModal: false,
      shouldValidate: false,
      errors: {'name': [], 'email': [], 'dataUrl': []}
    };
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
    // need to trigger validation here to ensure validate() gets the updated value
    if (this.state.shouldValidate) {
      this.props.handleEnter();
    }
  }

  showSignatureModal = () => {
    this.setState({showSignatureModal: true});
  }
  hideSignatureModal = () => {
    this.setState({showSignatureModal: false});
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
    this.hideSignatureModal();
    this.setState({shouldValidate: true});
  }

  handleKeyDown = (event) => {
    const { handleEnter } = this.props;
    if (event.keyCode === 13) {
      handleEnter();
    }
  }

  validate(cb) {
    var errors = {'name': [], 'email': [], 'dataUrl': []};
    let isValid = true;
    // Empty signature error handle
    if (this.props.value.dataUrl === '') {
      errors.dataUrl = ['Please sign your signature.'];
      isValid = false;
    }
    var emailErrors = valueIsValid(this.props.value.email, [{'type': 'isEmail'}]);
    if (emailErrors.length > 0) {
      errors.email = emailErrors;
      isValid = false;
    }
    // Empty signature name error handle
    var nameErrors = valueIsValid(this.props.value.name, [{'type': 'isRequired'}]);
    if (nameErrors.length > 0) {
      errors.name = nameErrors;
      isValid = false;
    }
    this.setState({shouldValidate: false});
    if (isValid) {
      this.hideSignatureModal();
      return cb(true);
    } else {
      this.setState({errors: errors});
      this.showSignatureModal();
      return cb(false);
    }
  }

  render() {
    const { value, isReadOnly, isInputLocked, autoFocus } = this.props;
    const preloadFonts = signatureFonts.map((font, index) => (
      <div className={`signature-font-preload preload-${font.name}`} key={index}>font</div>
    ));
    const that = this;
    return (
      <div className={styles.signature}>
        {value.dataUrl &&
          <div>
            <img src={value.dataUrl} alt="signature"
              className={styles.signatureImage}
              ref="signatureImage"
              tabIndex={0} onKeyDown={this.handleKeyDown}
            />
            <AppButton
              isDisabled={isInputLocked}
              size="lg"
              autoFocus={!value.dataUrl && autoFocus}
              onClick={that.showSignatureModal}>
              Re-sign
            </AppButton>
          </div>
        }
        {!isReadOnly && !value.dataUrl &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isInputLocked}
            autoFocus={!value.dataUrl && autoFocus}
            onClick={that.showSignatureModal} />
        }
        <Modal show={this.state.showSignatureModal} onHide={that.hideSignatureModal}>
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
              closeModal={that.hideSignatureModal}
            />
          </Modal.Body>
        </Modal>
        {preloadFonts}
      </div>
    );
  }
}

export default SignatureQuestion;
