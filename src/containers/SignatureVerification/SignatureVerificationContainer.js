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
  requestVerificationCode,
  changeCommitValue,
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
  requestVerificationCode,
  changeCommitValue
};

const mapStateToProps = (state) => {
  const { signatureVerification } = state;
  const {
    isPageBusy,
    isConsented,
    email,
    name,
    isCodeVerifyingModalOpen
  } = signatureVerification || INIT_SIGNATURE_STATE;
  return {
    isPageBusy,
    isConsented,
    email,
    name,
    isCodeVerifyingModalOpen
  };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureModal);
