import React, { Component, PropTypes } from 'react';
import FormHeader from 'components/Headers/FormHeader';
import IDVerificationForm from 'containers/IDVerificationFormContainer';
import styles from './IdentityVerification.scss';

export default class IdentityVerification extends Component {
  static propTypes = {
    submitIdentity: PropTypes.func.isRequired,
    requestSubmitIdentity: PropTypes.func,
    doneSubmitIdentity: PropTypes.func
  };

  static defaultProps = {
    requestSubmitIdentity: () => {},
    doneSubmitIdentity: () => {}
  }

  render() {
    const { submitIdentity, requestSubmitIdentity, doneSubmitIdentity } = this.props;
    return (
      <div className={styles.identityVerification}>
        <FormHeader title={'test title'} submitAnswer={function () {}} />
        <div className={styles.content}>
          <IDVerificationForm align="center"
            submitIdentity={submitIdentity}
            requestSubmitIdentity={requestSubmitIdentity}
            doneSubmitIdentity={doneSubmitIdentity}
          />
        </div>
      </div>
    );
  }
}
