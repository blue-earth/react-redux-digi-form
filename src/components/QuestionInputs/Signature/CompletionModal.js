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
    show: PropTypes.bool,                  // Modal display status
    closeModal: PropTypes.func.isRequired, // Redux store implemented close current modal function
    hasError: PropTypes.bool.isRequired,
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

  render() {
    const { show, commitValue, closeModal, hasError } = this.props;
    const { code } = this.state;
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
                The signature code has been sent to {commitValue.email}.
                {' '}
                <a href="javascript:;" className={styles.resendButton} onClick={this.handleResend}>Resend?</a>
              </p>
              <input placeholder="Code" className={styles.codeInput} value={code} onChange={this.handleChange} />
              <div className={styles.errorMessage}>
                {hasError && <span>Please input valid code</span>}
              </div>
              <div className={styles.buttonWrapper}>
                <AppButton size="lg" extraClass={styles.completeButton} onClick={this.handleSubmit}>
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
