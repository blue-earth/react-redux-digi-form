import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';

class EditAnswerModal extends Component {
  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ]).isRequired,
    question: PropTypes.object,
    onUpdate: PropTypes.func
  };

  handleUpdate = () => {
  }

  render() {
    const { handleHide, show, question } = this.props;
    const { primaryColour } = this.context;

    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby="ModalHeader">
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{color: primaryColour}}>
              {question.questionInstruction}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          content
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button bsStyle="link" onClick={handleHide}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'editAnswerModal' })(EditAnswerModal);
