import React, { Component, PropTypes } from 'react';
import IdentityVerificationHeader from 'components/Headers/IdentityVerificationHeader';
import IDVerificationForm from 'containers/IDVerification';
import styles from './IdentityVerificationView.scss';

export default class IdentityVerificationView extends Component {
  static propTypes = {
    fetchForm: PropTypes.func.isRequired,
    fetchPerson: PropTypes.func.isRequired,
    form: PropTypes.object,
    person: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { fetchForm, fetchPerson, params: { formId, personId } } = this.props;
    formId && fetchForm(formId);
    personId && fetchPerson(personId);
  }

  render() {
    const { form, person } = this.props;
    const title = form ? form.title : 'No form specified';
    return (
      <div className={styles.identityVerification}>
        <IdentityVerificationHeader title={title} />
        <div className={styles.content}>
          <IDVerificationForm align="center" person={person} />
        </div>
      </div>
    );
  }
}
