import connect from 'redux/utils/connect';
import {
  fetchForm
} from 'redux/modules/identityVerification';

import IdentityVerificationView from '../components/IdentityVerificationView';

const mapActionCreators = {
  fetchForm
};

const mapStateToProps = (state) => {
  const { identityVerification } = state;
  return identityVerification;
};

export default connect(mapStateToProps, mapActionCreators)(IdentityVerificationView);
