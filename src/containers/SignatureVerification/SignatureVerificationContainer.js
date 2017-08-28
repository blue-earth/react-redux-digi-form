import connect from 'redux/utils/connect';
import SignatureModal from 'components/QuestionInputs/Signature/SignatureModal';
import {
  updateSessionId,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified,
  INIT_SIGNATURE_STATE
} from 'redux/modules/signatureVerification';

const mapActionCreators = {
  updateSessionId,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified
};

const mapStateToProps = (state) => {
  const { signatureVerification, modal: { signatureVerificationModal }, formInteractive: { title } } = state;
  const {
    isPageBusy,
    isCodeVerified,
    hasCodeVerified
  } = signatureVerification || INIT_SIGNATURE_STATE;
  const isCodeVerifyingModalOpen = signatureVerificationModal && signatureVerificationModal.show || false;
  return {
    title,
    isPageBusy,
    isCodeVerifyingModalOpen,
    isCodeVerified,
    hasCodeVerified
  };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureModal);
