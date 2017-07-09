import { reduxForm } from 'redux-form';
import connect from 'redux/utils/connect';
import PassportForm from 'components/IDVerification/PassportForm';

export default reduxForm({
  form: 'idPassportForm'
})(PassportForm);
