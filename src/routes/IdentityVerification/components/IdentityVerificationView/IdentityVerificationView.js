import React, { Component, PropTypes } from 'react';
import IdentityVerificationHeader from 'components/Headers/IdentityVerificationHeader';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
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

  constructor(props) {
    super(props);
    this.state = {
      notice: 'We require additional information to verify your identification online'
    };
  }

  componentDidMount() {
    const { fetchForm, fetchPerson, params: { formId, personId } } = this.props;
    formId && fetchForm(formId);
    personId && fetchPerson(personId);
  }

  setNotice = (notice) => {
    this.setState({ notice });
  }

  render() {
    const { form, person } = this.props;
    const { notice } = this.state;
    const title = form ? form.title : 'No form specified';
    return (
      <div className={styles.identityVerification}>
        <IdentityVerificationHeader title={title} />
        <div className={styles.content}>
          <IDVerificationTitle align="center" notice={notice} />
          <IDVerificationForm person={person} setNotice={this.setNotice} />
        </div>
      </div>
    );
  }
}
