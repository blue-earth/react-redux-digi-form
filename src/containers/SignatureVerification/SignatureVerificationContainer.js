import connect from 'redux/utils/connect';
import SignatureQuestion from 'components/QuestionTypes/SignatureQuestion';
import {
  updateSessionId,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified,
  closeVerificationModal,
  INIT_SIGNATURE_STATE
} from 'redux/modules/signatureVerification';

const mapActionCreators = {
  updateSessionId,
  verifyEmail,
  verifyEmailCode,
  requestVerificationCode,
  submitValue,
  resetCodeVerified,
  closeVerificationModal
};

const mapStateToProps = (state) => {
  const { signatureVerification } = state;
  const {
    isPageBusy,
    verificationWidgetIsActive,
    isCodeVerified,
    hasCodeVerified
  } = signatureVerification || INIT_SIGNATURE_STATE;
  // const isCodeVerifyingModalOpen = signatureVerificationModal && signatureVerificationModal.show || false;
  return {
    isPageBusy,
    verificationWidgetIsActive,
    isCodeVerified,
    hasCodeVerified
  };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureQuestion);
