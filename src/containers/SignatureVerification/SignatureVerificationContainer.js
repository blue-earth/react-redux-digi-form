import connect from 'redux/utils/connect';
import SignatureModal from 'components/QuestionInputs/Signature/SignatureModal';
import {
  updateSessionId,
  closeVerificationModal,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified,
  INIT_SIGNATURE_STATE
} from 'redux/modules/signatureVerification';

const mapActionCreators = {
  updateSessionId,
  closeVerificationModal,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified
};

const mapStateToProps = (state) => {
  const { signatureVerification } = state;
  const {
    isPageBusy,
    isCodeVerifyingModalOpen,
    isCodeVerified
  } = signatureVerification || INIT_SIGNATURE_STATE;
  return {
    isPageBusy,
    isCodeVerifyingModalOpen,
    isCodeVerified
  };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureModal);
