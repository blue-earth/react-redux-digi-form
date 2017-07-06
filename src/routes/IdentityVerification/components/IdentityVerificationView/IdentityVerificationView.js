import React, { Component, PropTypes } from 'react';
import FormHeader from 'components/Headers/FormHeader';
import IDVerificationForm from 'containers/IDVerificationFormContainer';
import styles from './IdentityVerificationView.scss';

export default class IdentityVerificationView extends Component {
  static propTypes = {
    submitIdentity: PropTypes.func.isRequired,
    requestSubmitIdentity: PropTypes.func.isRequired,
    doneSubmitIdentity: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    removeAttachment: PropTypes.func.isRequired
  };

  render() {
    const { submitIdentity, requestSubmitIdentity, doneSubmitIdentity,
      addAttachment, removeAttachment } = this.props;
    return (
      <div className={styles.identityVerification}>
        <FormHeader title={'test title'} submitAnswer={function () {}} />
        <div className={styles.content}>
          <IDVerificationForm align="center"
            submitIdentity={submitIdentity}
            requestSubmitIdentity={requestSubmitIdentity}
            doneSubmitIdentity={doneSubmitIdentity}
            addAttachment={addAttachment}
            removeAttachment={removeAttachment}
          />
        </div>
      </div>
    );
  }
}
