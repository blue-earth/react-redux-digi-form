import { reduxForm } from 'redux-form';
import _ from 'lodash';
import PassportForm from 'components/IDVerification/PassportForm';

const validate = values => {
  const errors = {
    verification_data: {
      passport: {}
    },
    person: {}
  };
  const person = _.get(values, ['person'], {});
  const passport = _.get(values, ['verification_data', 'passport'], {});

  if (!person.first_name) {
    errors.person.first_name = ['First Name is required'];
  }
  if (!person.last_name) {
    errors.person.last_name = ['Last Name is required'];
  }
  if (!person.date_of_birth) {
    errors.person.date_of_birth = ['Date of birth is required'];
  }
  if (!person.email) {
    errors.person.email = ['Email is required'];
  }
  if (!person.gender) {
    errors.person.gender = ['Gender is required'];
  }
  if (!passport.number) {
    errors.person.number = ['Passport Number is required'];
  }
  if (!passport.place_of_birth) {
    errors.person.place_of_birth = ['Place of Birth is required'];
  }
  if (!passport.expiry_date) {
    errors.person.expiry_date = ['Expiry Date is required'];
  }
  if (!values.terms_conditions) {
    errors.terms_conditions = ['You need to accept our terms and conditions'];
  }
  return errors;
};

export default reduxForm({
  form: 'idPassportForm',
  validate
})(PassportForm);
