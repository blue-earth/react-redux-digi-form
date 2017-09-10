import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';

class DeleteGroupFailureModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  render() {
    const { show, handleHide } = this.props;
    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby="ModalHeader">
        <Modal.Body>
          Please delete or move all the questions in this section.
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={handleHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'deleteGroupFailureModal' })(DeleteGroupFailureModal);
