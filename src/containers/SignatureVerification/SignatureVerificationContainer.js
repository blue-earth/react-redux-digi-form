import connect from 'redux/utils/connect';
import SignatureModal from 'components/QuestionInputs/Signature/SignatureModal';
import {
  fetchEmailList,
  requestVerificationCode,
  hideVerificationModal,
  changeEmail,
  verifyEmailCode,
  INIT_SIGNATURE_STATE
} from 'redux/modules/signatureVerification';

const mapActionCreators = {
  fetchEmailList,
  requestVerificationCode,
  hideVerificationModal,
  changeEmail,
  verifyEmailCode
};

const mapStateToProps = (state) => {
  const { signatureVerification } = state;
  const { isPageBusy, email, emailList, isVerifing } = signatureVerification || INIT_SIGNATURE_STATE;
  return { isPageBusy, email, emailList, isVerifing };
};

export default connect(mapStateToProps, mapActionCreators)(SignatureModal);
