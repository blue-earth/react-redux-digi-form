import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { connectModal } from 'redux-modal';
import connect from 'redux/utils/connect';
import AppButton from 'components/Buttons/AppButton';
import styles from './ChangePasswordModal.scss';

class PasswordInput extends Component {
  static propTypes = {
    input: PropTypes.array,
    label: PropTypes.string,
    type: PropTypes.string,
    meta: PropTypes.object
  };

  render() {
    const { input, label, type, meta: {error} } = this.props;
    const errorMessage = error && error.length > 0 ? error[0] : '';
    return (
      <div>
        {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
        <input
          {...input}
          onFocus={this.handleFocus}
          className={styles.emailInput}
          value={input.value}
          placeholder={label}
          type={type} />
      </div>
    );
  }
}

class ChangePasswordModal extends Component {

  static propTypes = {
    reset: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleHide: PropTypes.func,
    show: PropTypes.bool,
    submitting: PropTypes.bool
  };

  handleHide = () => {
    const {reset, handleHide} = this.props;
    reset();
    handleHide();
  }

  render() {
    const { show, handleSubmit, onSubmit, submitting } = this.props;
    return (
      <Modal show={show} onHide={this.handleHide}
        className={styles.changePasswordModal}
        dialogClassName={styles.changePasswordModalDialog}
      >
        <Modal.Header bsClass={styles.modalHeader} closeButton></Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            Change password
          </h3>
          <div className={styles.contentWrapper}>
            <Field component={PasswordInput} type="password"
              name="old_password"
              label="Old password"
              />
            <Field component={PasswordInput} type="password"
              name="new_password1"
              label="New password"
              />
            <Field component={PasswordInput} type="password"
              name="new_password2"
              label="Repeat new password"
              />
            <AppButton extraClass={styles.sendButton}
              onClick={handleSubmit(onSubmit)}
              isBusy={submitting}>
              Change password
            </AppButton>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const modal = connectModal({ name: 'changePasswordModal' })(ChangePasswordModal);

export default connect(
  state => ({
    initialValues: {}
  })
)(reduxForm({
  form: 'passwordForm',
  enableReinitialize: true
})(modal));
