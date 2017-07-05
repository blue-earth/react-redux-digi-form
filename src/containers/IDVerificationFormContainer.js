import { reduxForm } from 'redux-form';
import IDVerificationForm from 'components/IDVerification/IDVerificationForm';
import idVerificationFormSchema, {
  identityConstants } from 'schemas/idVerificationFormSchema';

export default reduxForm({
  form: 'IDVerificationForm',
  initialValues: {
    'type': identityConstants.DVSPASSPORT
  },
  ...idVerificationFormSchema
})(IDVerificationForm);
