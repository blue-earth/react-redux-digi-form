import React, {
  Component,
  PropTypes
} from 'react';
import FormEnterButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import AppButton from 'components/Buttons/AppButton/AppButton';
import SignatureModal from 'containers/SignatureVerification';
import styles from './SignatureQuestion.scss';
import { signatureFonts } from 'schemas/signatureSchema';

class SignatureQuestion extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    showModal: PropTypes.func,
    onEnterKey: PropTypes.func,
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
      showModal: false;
    };
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
    this.props.onChange;
  }

  toggleModal = () => {
    this.setState({showModal: !this.state.showModal});
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
    const { onEnterKey } = this.props;
    if (event.keyCode === 13) {
      onEnterKey();
    }
  }

  render() {
    const { showModal, value, isReadOnly, isDisabled, autoFocus } = this.props;
    const preloadFonts = signatureFonts.map((font, index) => (
      <div className={`signature-font-preload preload-${font.name}`} key={index}>font</div>
    ));
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
              isDisabled={isDisabled}
              size="lg"
              autoFocus={!value.dataUrl && autoFocus}
              onClick={function () { showModal('signatureModal', {value, isConsented: true}); }}>
              Re-sign
            </AppButton>
          </div>
        }
        {!isReadOnly && !value.dataUrl &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isDisabled}
            autoFocus={!value.dataUrl && autoFocus}
            onClick={function () { showModal('signatureModal', {value}); }} />
        }
        <Modal show={this.state.showModal} onHide={this.toggleModal}>
          <Modal.Header>
            <Modal.Title>YOUR SIGNATURE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SignatureWidget
              value={this.props.value}
              formTitle={this.props.formTitle}
              isConsented={false}
              onChange={this.handleChange}
              closeModal={this.toggleModal}
            />
          </Modal.Body>
        </Modal>
        {preloadFonts}
      </div>
    );
  }
}

export default SignatureQuestion;
