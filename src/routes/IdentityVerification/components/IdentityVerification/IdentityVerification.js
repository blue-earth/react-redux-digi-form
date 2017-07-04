import React, { Component, PropTypes } from 'react';
import FormHeader from 'components/Headers/FormHeader';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
import IDVerificationForm from 'containers/IDVerificationFormContainer';
import styles from './IdentityVerification.scss';

export default class IdentityVerification extends Component {
  static propTypes = {
    submitIdentity: PropTypes.func.isRequired
  };

  render() {
    const { submitIdentity } = this.props;
    return (
      <div className={styles.identityVerification}>
        <FormHeader title={'test title'} submitAnswer={function () {}} />
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <IDVerificationTitle />
            <IDVerificationForm submitIdentity={submitIdentity} />
          </div>
        </div>
      </div>
    );
  }
}
