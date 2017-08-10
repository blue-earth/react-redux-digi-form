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
import { connectModal } from 'redux-modal';
import styles from './CompletionModal.scss';

class CompletionModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired, // Modal hide function
    show: PropTypes.bool,                  // Modal display status
    cancelModal: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    resendCode: PropTypes.func.isRequired
  };

  handleComplete = () => {
    this.props.verifyEmailCode(this.refs.codeInput.value, this.props.closeModal);
  }
  handleResend = () => {
    this.props.resendCode();
  }

  render() {
    const { show, email, closeModal } = this.props;
    return (
      <Modal backdrop="static" show={show}
        className={styles.completionModal} dialogClassName={styles.modalWrapper}>
        <h3 className={styles.modalHeader}>
            Enter signature completion code
        </h3>
        <Modal.Body bsClass={styles.completionModalWrapper}>
          <Row>
            <Col xs={8} xsPush={2}>
              <p className={styles.info}>
                A 4 digit signature code has been sent to {email}.
                {' '}
                <a href="javascript:;" className={styles.resendButton} onClick={this.handleResend}>Resend?</a>
              </p>
              <input ref="codeInput" placeholder="Code" className={styles.codeInput} />
              <div className={styles.buttonWrapper}>
                <AppButton size="lg" extraClass={styles.completeButton} onClick={this.handleComplete}>
                  Complete
                </AppButton>
              </div>
              <Button onClick={closeModal} bsStyle="link" className={styles.cancelButton}>
                Go back
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'signatureVerificationModal' })(CompletionModal);
