import connect from 'redux/utils/connect';
import SignatureModal from 'components/QuestionInputs/Signature/SignatureModal';
import {
  updateSessionId,
  closeVerificationModal,
  changeEmail,
  changeName,
  changeConsented,
  verifyEmail,
  verifyEmailCode,
  submitSignature,
  requestVerificationCode,
  closeCodeVerify,
  resetVerifyErrorMessage,
  INIT_SIGNATURE_STATE
} from 'redux/modules/signatureVerification';

const mapActionCreators = {
  updateSessionId,
  closeVerificationModal,
  changeEmail,
  changeName,
  changeConsented,
  verifyEmail,
  verifyEmailCode,
  submitSignature,
  requestVerificationCode,
  closeCodeVerify,
  resetVerifyErrorMessage
};

const mapStateToProps = (state) => {
  const { signatureVerification } = state;
  const {
    isPageBusy,
    isConsented,
    email,
    name,
    isVerifyingCode,
    isCodeVerified
  } = signatureVerification || INIT_SIGNATURE_STATE;
  return {
    isPageBusy,
    isConsented,
    email,
    name,
    isVerifyingCode,
    isCodeVerified
  };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureModal);
