import { reduxForm } from 'redux-form';
import _ from 'lodash';
import DriversLicenseForm from 'components/IDVerification/DriversLicenseForm';

const validate = values => {
  const errors = {
    verification_data: {
      driver_license: {}
    },
    person: {}
  };
  const person = _.get(values, ['person'], {});
  const driversLicense = _.get(values, ['verification_data', 'driver_license'], {});

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
  if (!driversLicense.state) {
    errors.verification_data.driver_license.state = ['State is required'];
  }
  if (!driversLicense.number) {
    errors.verification_data.driver_license.number = ['Driver\'s license no. is required'];
  }
  if (!driversLicense.place_of_birth) {
    errors.verification_data.driver_license.place_of_birth = ['Place of Birth is required'];
  }
  if (!driversLicense.expiry_date) {
    errors.verification_data.driver_license.expiry_date = ['Expiry Date is required'];
  }
  if (!values.terms_conditions) {
    errors.terms_conditions = ['You need to accept our terms and conditions'];
  }
  return errors;
};

export default reduxForm({
  form: 'idDriversLicenseForm',
  validate
})(DriversLicenseForm);
