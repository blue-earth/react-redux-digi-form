import React, {
  Component,
  PropTypes
} from 'react';
import FormEnterButton from 'components/Buttons/FormEnterButton/FormEnterButton';
import AppButton from 'components/Buttons/AppButton/AppButton';
import SignatureModal from 'containers/SignatureVerification';
import styles from './Signature.scss';
import { signatureFonts } from 'schemas/signatureSchema';

class Signature extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    showModal: PropTypes.func,
    onEnterKey: PropTypes.func
  };

  static defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    value: {},
    onChange: () => {},
    show: () => {}
  };

  componentDidMount() {
    this.focusSignatureImage();
  }

  componentDidUpdate() {
    this.focusSignatureImage();
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

  handleFocus = (event) => {
    const { onFocus } = this.props;
    if (typeof onFocus === 'function') onFocus();
  }

  handleBlur = (event) => {
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') onBlur();
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
          <img src={value.dataUrl} alt="signature"
            className={styles.signatureImage}
            ref="signatureImage"
            tabIndex={0} onKeyDown={this.handleKeyDown} />
        }
        <div>
          {value.dataUrl &&
            <AppButton
              isDisabled={isDisabled}
              size="lg"
              autoFocus={!value.dataUrl && autoFocus}
              onClick={function () { showModal('signatureModal', {value, isConsented: true}); }}>
              Re-sign
            </AppButton>
          }
        </div>
        {!isReadOnly && !value.dataUrl &&
          <FormEnterButton buttonLabel="Sign"
            isDisabled={isDisabled}
            autoFocus={!value.dataUrl && autoFocus}
            onClick={function () { showModal('signatureModal', {value}); }} />
        }
        <SignatureModal />
        {preloadFonts}
      </div>
    );
  }
}

export default Signature;
