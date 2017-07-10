import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import MedicareCardForm from 'components/IDVerification/MedicareCardForm';

const validate = values => {
  const errors = {
    verification_data: {
      medicare_card: {}
    },
    person: {}
  };
  const person = _.get(values, ['person'], {});
  const medicareCard = _.get(values, ['verification_data', 'medicare_card'], {});

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
  if (!medicareCard.number) {
    errors.verification_data.medicare_card.number = ['Driver\'s license no. is required'];
  }
  if (!medicareCard.reference_number) {
    errors.verification_data.medicare_card.reference_number = ['Reference number is required'];
  }
  if (!medicareCard.expiry_date_month) {
    errors.verification_data.medicare_card.expiry_date_month = ['Required'];
  }
  if (!medicareCard.expiry_date_year) {
    errors.verification_data.medicare_card.expiry_date_year = ['Required'];
  }
  if (!medicareCard.colour) {
    errors.verification_data.medicare_card.colour = ['Medicare colour is required'];
  }
  if (!values.terms_conditions) {
    errors.terms_conditions = ['You need to accept our terms and conditions'];
  }
  return errors;
};

const selectInitialValues = (state) => {
  const person = _.get(state, ['identityVerification', 'person'], {});
  return {
    person: _.pick(person, ['first_name', 'last_name', 'email', 'date_of_birth'])
  };
};

export default connect(
  state => ({
    initialValues: selectInitialValues(state)
  })
)(reduxForm({
  form: 'idMedicareCardForm',
  validate
})(MedicareCardForm));
