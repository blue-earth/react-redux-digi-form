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

class SignatureQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isInputLocked: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    showModal: PropTypes.func,
    handleEnter: PropTypes.func,
    formTitle: PropTypes.string
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    value: {},
    onChange: () => {},
    showModal: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      showSignatureModal: false
    };
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
    this.props.onChange;
  }

  toggleSignatureModal = () => {
    this.setState({showSignatureModal: !this.state.showSignatureModal});
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
    console.log('SignatureQuestion ', value);
  }

  handleKeyDown = (event) => {
    const { handleEnter } = this.props;
    if (event.keyCode === 13) {
      handleEnter();
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
              onClick={function () { that.toggleSignatureModal(); }}>
              Re-sign
            </AppButton>
          </div>
        }
        {!isReadOnly && !value.dataUrl &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isInputLocked}
            autoFocus={!value.dataUrl && autoFocus}
            onClick={function () { that.toggleSignatureModal(); }} />
        }
        <Modal show={this.state.showSignatureModal} onHide={that.toggleSignatureModal}>
          <Modal.Header>
            <Modal.Title>YOUR SIGNATURE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SignatureWidget
              value={this.props.value}
              formTitle={this.props.formTitle}
              isConsented={false}
              onChange={this.handleChange}
              closeModal={that.toggleSignatureModal}
            />
          </Modal.Body>
        </Modal>
        {preloadFonts}
      </div>
    );
  }
}

export default SignatureQuestion;
