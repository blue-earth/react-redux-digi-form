import { connect } from 'react-redux';
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
    errors.person.first_name = ['First name is required'];
  }
  if (!person.last_name) {
    errors.person.last_name = ['Last name is required'];
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
    errors.verification_data.passport.number = ['Passport no. is required'];
  }
  if (!passport.place_of_birth) {
    errors.verification_data.passport.place_of_birth = ['Place of birth is required'];
  }
  if (!passport.expiry_date) {
    errors.verification_data.passport.expiry_date = ['Expiry date is required'];
  }
  if (!values.terms_conditions) {
    errors.terms_conditions = ['You need to accept our terms and conditions'];
  }
  return errors;
};

const selectInitialValues = (state) => {
  const person = _.get(state, ['identityVerification', 'person'], {});
  return {
    person: _.pick(person, ['first_name', 'last_name', 'email', 'date_of_birth', 'gender'])
  };
};

export default connect(
  state => ({
    initialValues: selectInitialValues(state)
  })
)(reduxForm({
  form: 'idPassportForm',
  validate
})(PassportForm));
