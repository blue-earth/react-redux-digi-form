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
    cancelModal: PropTypes.func
  };

  handleHide = () => {
    const { cancelModal, handleHide } = this.props;
    cancelModal();
    handleHide();
  }

  render() {
    const { show, handleHide } = this.props;
    return (
      <Modal backdrop="static" show={show} onHide={handleHide}
        className={styles.completionModal} dialogClassName={styles.modalWrapper}>
        <h3 className={styles.modalHeader}>
            Enter signature completion code
        </h3>
        <Modal.Body bsClass={styles.completionModalWrapper}>
          <Row>
            <Col xs={8} xsPush={2}>
              <p className={styles.info}>
                A 4 digit signature code has been sent to {'mccown@emondo.com.au'}.
                {' '}
                <a href="javascript: void(0)" className={styles.resendButton}>Resend?</a>
              </p>
              <input placeholder="Code" className={styles.codeInput} />
              <div className={styles.buttonWrapper}>
                <AppButton size="lg" extraClass={styles.completeButton}>
                  Complete
                </AppButton>
              </div>
              <Button onClick={this.handleHide} bsStyle="link" className={styles.cancelButton}>
                Go back
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'signatureCompletionModal' })(CompletionModal);
