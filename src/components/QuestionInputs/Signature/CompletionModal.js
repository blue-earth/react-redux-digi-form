import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import { Field, reduxForm } from 'redux-form';
import { connectModal } from 'redux-modal';
import styles from './CompletionModal.scss';

class CompletionModal extends Component {
  static propTypes = {
    show: PropTypes.bool,                  // Modal display status
    closeModal: PropTypes.func.isRequired, // Redux store implemented close current modal function
    email: PropTypes.string.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    resendCode: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,  // redux-form submit handler
    error: PropTypes.string                   // redux-form error object
  };

  handleResend = () => {
    this.props.resendCode();
  }

  render() {
    const { show, email, closeModal, error, handleSubmit, verifyEmailCode } = this.props;
    return (
      <Modal backdrop="static" show={show}
        className={styles.completionModal} dialogClassName={styles.modalWrapper}>
        <h3 className={styles.modalHeader}>
            Enter signature completion code
        </h3>
        <Modal.Body bsClass={styles.completionModalWrapper}>
          <Row>
            <Col xs={8} xsPush={2}>
              <form onSubmit={handleSubmit(verifyEmailCode)}>
                <p className={styles.info}>
                  The signature code has been sent to {email}.
                  {' '}
                  <a href="javascript:;" className={styles.resendButton} onClick={this.handleResend}>Resend?</a>
                </p>
                <Field name="code" placeholder="Code" className={styles.codeInput} component="input" />
                <div className={styles.errorMessage}>
                  {error && <span>{error}</span>}
                </div>
                <div className={styles.buttonWrapper}>
                  <AppButton size="lg" extraClass={styles.completeButton} onClick={handleSubmit(verifyEmailCode)}>
                    Complete
                  </AppButton>
                </div>
                <Button onClick={closeModal} bsStyle="link" className={styles.cancelButton}>
                  Go back
                </Button>
              </form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

const modal = connectModal({ name: 'signatureVerificationModal' })(CompletionModal);
export default reduxForm({
  form: 'signatureVerificationCode'
})(modal);
