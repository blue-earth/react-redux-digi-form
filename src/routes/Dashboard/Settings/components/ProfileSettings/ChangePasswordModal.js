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
    error: PropTypes.array,
    resetError: PropTypes.func
  };

  handleFocus = (event) => {
    this.props.resetError();
  }
  render() {
    const {input, label, type, error} = this.props;
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
    resetErrorMessages: PropTypes.func,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleHide: PropTypes.func,
    show: PropTypes.bool,
    isPageBusy: PropTypes.bool,
    errorMessages: PropTypes.object
  };

  handleHide = () => {
    const {resetErrorMessages, reset, handleHide} = this.props;
    resetErrorMessages();
    reset();
    handleHide();
  }

  render() {
    const { show, handleSubmit, onSubmit, errorMessages, isPageBusy, resetErrorMessages } = this.props;
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
              error={errorMessages.old_password}
              resetError={resetErrorMessages} />
            <Field component={PasswordInput} type="password"
              name="new_password1"
              label="New password"
              error={errorMessages.new_password1}
              resetError={resetErrorMessages} />
            <Field component={PasswordInput} type="password"
              name="new_password2"
              label="Repeat new password"
              error={errorMessages.new_password2}
              resetError={resetErrorMessages} />
            <AppButton extraClass={styles.sendButton}
              onClick={handleSubmit(onSubmit)}
              isBusy={isPageBusy}>
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
