import connect from 'redux/utils/connect';
import {
  fetchForm,
  fetchPerson
} from 'redux/modules/identityVerification';

import IdentityVerificationView from '../components/IdentityVerificationView';

const mapActionCreators = {
  fetchForm,
  fetchPerson
};

const mapStateToProps = (state) => {
  const { identityVerification } = state;
  return identityVerification;
};

export default connect(mapStateToProps, mapActionCreators)(IdentityVerificationView);
