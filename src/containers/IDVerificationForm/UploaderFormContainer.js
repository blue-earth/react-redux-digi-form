import { reduxForm } from 'redux-form';
import UploaderForm from 'components/IDVerification/UploaderForm';

const validate = values => {
  const errors = {};

  if (!values.attachment_ids) {
    errors.attachment_ids = ['You should upload attachments first.'];
  }
  if (!values.terms_conditions) {
    errors.terms_conditions = ['You need to accept our terms and conditions'];
  }
  return errors;
};

export default reduxForm({
  form: 'idUploaderForm',
  validate
})(UploaderForm);
