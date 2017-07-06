import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  submitIdentity,
  requestSubmitIdentity,
  doneSubmitIdentity,
  addAttachment,
  removeAttachment
} from 'redux/modules/identityVerification';

import IdentityVerificationView from '../components/IdentityVerificationView';

const mapActionCreators = {
  showModal: show,
  submitIdentity,
  requestSubmitIdentity,
  doneSubmitIdentity,
  addAttachment,
  removeAttachment
};

const mapStateToProps = (state) => {
  const { identityVerification } = state;
  return identityVerification;
};

export default connect(mapStateToProps, mapActionCreators)(IdentityVerificationView);
