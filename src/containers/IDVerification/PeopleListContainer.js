import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import { validateIsEmail } from 'helpers/validationHelper';
import PeopleList from 'components/IDVerification/PeopleList';

const validate = values => {
  const errors = {
    people: []
  };
  errors.people = _.map(values.people, (person) => {
    if (person.selected && !person.email) {
      return { email: ['Email is required'] };
    }
    if (person.selected && !validateIsEmail(person.email)) {
      return { email: ['Invalid email address'] };
    }
    return {};
  });
  return errors;
};

const selector = formValueSelector('peopleListForm');

export default connect(
  (state, props) => ({
    initialValues: {
      people: _.filter(props.people, { status: 'PENDING' })
    },
    pendingPeople: selector(state, 'people'),
    verifiedPeople: _.filter(props.people, { status: 'VERIFIED' })
  })
)(reduxForm({
  form: 'peopleListForm',
  enableReinitialize: true,
  validate
})(PeopleList));
