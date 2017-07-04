import { reduxForm } from 'redux-form';
import IDVerificationForm from 'components/IDVerification/IDVerificationForm';
import idVerificationFormSchema from 'schemas/idVerificationFormSchema';

export default reduxForm({
  form: 'IDVerificationForm',
  ...idVerificationFormSchema
})(IDVerificationForm);
