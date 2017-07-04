import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  submitIdentity
} from 'redux/modules/identityVerification';

import IdentityVerification from '../components/IdentityVerification';

const mapActionCreators = {
  showModal: show,
  submitIdentity
};

const mapStateToProps = (state) => {
  const { identityVerification } = state;
  return identityVerification;
};

export default connect(mapStateToProps, mapActionCreators)(IdentityVerification);
