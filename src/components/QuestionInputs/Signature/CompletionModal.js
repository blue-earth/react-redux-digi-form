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
import { FaClose } from 'react-icons/lib/fa';
import styles from './CompletionModal.scss';

class CompletionModal extends Component {
  static propTypes = {
    show: PropTypes.bool,                  // Modal display status
    handleHide: PropTypes.func.isRequired,      // Hide modal function from 'redux-modal'
    hasError: PropTypes.bool.isRequired,
    isPageBusy: PropTypes.bool,
    hasCodeVerified: PropTypes.bool,
    commitValue: PropTypes.object.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    resendCode: PropTypes.func.isRequired,
    resetCodeVerified: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  handleResend = () => {
    const { resendCode, commitValue } = this.props;
    resendCode(commitValue);
  }
  handleChange = (event) => {
    this.setState({
      code: event.target.value
    });
    this.props.resetCodeVerified();
  }

  handleSubmit = () => {
    const { commitValue, verifyEmailCode } = this.props;
    const { code } = this.state;
    verifyEmailCode({
      ...commitValue,
      code
    });
  }

  handleCloseModal = () => {
    const {handleHide} = this.props;
    handleHide('signatureVerificationModal');
  }

  render() {
    const { show, commitValue, hasError, isPageBusy, hasCodeVerified } = this.props;
    const { code } = this.state;
    return (
      <Modal backdrop="static" show={show}
        className={styles.completionModal} dialogClassName={styles.modalWrapper}>
        <div style={{position: 'relative'}}>
          <h3 className={styles.modalHeader}>
              Enter signature completion code
          </h3>
          <button className={styles.closeModalButton} onClick={this.handleCloseModal}>
            <FaClose size={16} />
          </button>
        </div>
        <Modal.Body bsClass={styles.completionModalWrapper}>
          <Row>
            <Col sm={8} smPush={2}>
              <p className={styles.info}>
                The signature code has been sent to {commitValue.email}.
                {' '}
                <a href="javascript:;" className={styles.resendButton} onClick={this.handleResend}>Resend?</a>
              </p>
              <input placeholder="Code" className={styles.codeInput} value={code} onChange={this.handleChange} />
              <div className={styles.errorMessage}>
                {hasError && <span>Please input valid code</span>}
              </div>
              <div className={styles.buttonWrapper}>
                <AppButton
                  size="lg"
                  extraClass={styles.completeButton}
                  onClick={this.handleSubmit}
                  isBusy={isPageBusy}
                  isSucceed={hasCodeVerified}>
                  Complete
                </AppButton>
              </div>
              <Button onClick={this.handleCloseModal} bsStyle="link" className={styles.cancelButton}>
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
