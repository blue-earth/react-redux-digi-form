import connect from 'redux/utils/connect';
import IDVerificationForm from 'components/IDVerification/IDVerificationForm';
import { show } from 'redux-modal';
import {
  setIdType,
  submitIdentity,
  requestUploadIdFile,
  doneUploadIdFile
} from 'redux/modules/idVerificationForm';

const mapActionCreators = {
  showModal: show,
  setIdType,
  submitIdentity,
  requestUploadIdFile,
  doneUploadIdFile
};

const mapStateToProps = (state) => {
  const { idVerificationForm } = state;
  return idVerificationForm;
};

export default connect(mapStateToProps, mapActionCreators)(IDVerificationForm);
