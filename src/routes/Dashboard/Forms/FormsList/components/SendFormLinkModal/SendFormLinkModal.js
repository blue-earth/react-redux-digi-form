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
import { validateIsEmail } from 'helpers/validationHelper';
import styles from './SendFormLinkModal.scss';

class SendFormLinkModal extends Component {
  static propTypes = {
    show: PropTypes.bool,                  // Modal display status
    handleHide: PropTypes.func.isRequired,      // Hide modal function from 'redux-modal'
    formId: PropTypes.number.isRequired,
    isPageBusy: PropTypes.bool,
    sendFormLink: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isEmailValid: true
    };
  }

  handleCloseModal = () => {
    this.props.handleHide();
  }

  handleChange = (event) => {
    this.setState({
      email: event.target.value,
      isEmailValid: true
    });
  }

  handleSend = () => {
    const { formId, sendFormLink } = this.props;
    const { email } = this.state;
    if (validateIsEmail(email)) {
      sendFormLink(formId, email);
    } else {
      this.setState({
        isEmailValid: false
      });
    }
  }

  render() {
    const { show, isPageBusy } = this.props;
    const { email, isEmailValid } = this.state;
    return (
      <Modal backdrop="static" show={show}
        className={styles.sendFormLinkModal} dialogClassName={styles.modalWrapper}>
        <div style={{position: 'relative'}}>
          <h3 className={styles.modalHeader}>
            Send Form Link
          </h3>
        </div>
        <Modal.Body bsClass={styles.sendFormLinkModalWrapper}>
          <Row>
            <Col sm={10} smPush={1}>
              <p className={styles.info}>
                Input an email address <br />
                to send a form link to.
              </p>
              <input placeholder="Email" className={styles.input} value={email} onChange={this.handleChange} />
              <div className={styles.buttonWrapper}>
                <div className={styles.errorMessage}>
                  {!isEmailValid && <span>Please input a valid email</span>}
                </div>
                <AppButton
                  size="lg"
                  extraClass={styles.sendButton}
                  isBusy={isPageBusy}
                  onClick={this.handleSend}>
                  Send
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

export default connectModal({ name: 'sendFormLinkModal' })(SendFormLinkModal);
