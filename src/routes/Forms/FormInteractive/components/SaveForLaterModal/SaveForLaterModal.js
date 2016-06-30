import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getSessionURL } from 'helpers/formInteractiveHelper';
import { connectModal } from 'redux-modal';

class SaveForLaterModal extends Component {

  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    formId: PropTypes.number,
    sessionId: PropTypes.number
  };

  render() {
    const { sessionId, formId, show, handleHide } = this.props;

    return (
      <Modal show={show} bsSize="large"
        onHide={this.handleHideTempModal}>
        <Modal.Header closeButton>
          <Modal.Title>Form Saved.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here's the URL to restore your session.</p>
          <div className="form-control">{getSessionURL(formId, sessionId)}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'saveForLaterModal' })(SaveForLaterModal);
