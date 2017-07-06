import { reduxForm } from 'redux-form';
import connect from 'redux/utils/connect';
import IDVerificationForm from 'components/IDVerification/IDVerificationForm';
import idVerificationFormSchema, {
  identityConstants } from 'schemas/idVerificationFormSchema';
import { show } from 'redux-modal';
import {
  submitIdentity,
  requestSubmitIdentity,
  doneSubmitIdentity,
  addAttachment,
  removeAttachment
} from 'redux/modules/identityVerification';

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

export default reduxForm({
  form: 'IDVerificationForm',
  initialValues: {
    'type': identityConstants.DVSPASSPORT
  },
  ...idVerificationFormSchema
})(connect(mapStateToProps, mapActionCreators)(IDVerificationForm));
