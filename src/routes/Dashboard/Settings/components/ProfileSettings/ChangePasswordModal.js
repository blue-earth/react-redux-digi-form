import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { Field } from 'redux-form';
import { connectModal } from 'redux-modal';
import AppButton from 'components/Buttons/AppButton';

import styles from './ChangePasswordModal.scss';

class ChangePasswordModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };
  render() {
    const { show, handleHide } = this.props;
    return (
      <Modal show={show} onHide={handleHide}
        className={styles.changePasswordModal}
        dialogClassName={styles.changePasswordModalDialog}
      >
        <Modal.Header bsClass={styles.modalHeader} closeButton></Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            Change password
          </h3>
          <div className={styles.contentWrapper}>
            <Field component="input" type="password"
              name="oldPassword" className={styles.emailInput} placeholder="Old password" />
            <Field component="input" type="password"
              name="newPassword" className={styles.emailInput} placeholder="New password" />
            <Field component="input" type="password"
              name="repeatPassword" className={styles.emailInput} placeholder="Repeat new password" />
            <AppButton extraClass={styles.sendButton}>
              Change password
            </AppButton>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'changePasswordModal' })(ChangePasswordModal);
