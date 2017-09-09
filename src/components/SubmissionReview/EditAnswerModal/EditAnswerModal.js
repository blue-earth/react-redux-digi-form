import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import QuestionInteractive from 'components/Questions/QuestionInteractive';
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
    ]),
    question: PropTypes.object,
    onUpdate: PropTypes.func,  // TODO: where the ... does this come from?
    formId: PropTypes.number,
    sessionId: PropTypes.number,
    formTitle: PropTypes.string,
    isInputLocked: PropTypes.bool,
    setInputLocked: PropTypes.func,
    changeCurrentState: PropTypes.func,
    storeAnswer: PropTypes.func,
    ensureSessionExists: PropTypes.func
  };

  handleUpdate = () => {
    console.log('EditAnswerModal -> handleUpdate');
  }

  render() {
    const { handleHide, show, question } = this.props;

    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Body>
          {question.questionInstruction}
          <QuestionInteractive
            question={this.props.question}
            value={this.props.value}
            formId={this.props.formId}
            sessionId={this.props.sessionId}
            formTitle={this.props.formTitle}
            isInputLocked={this.props.isInputLocked}
            setInputLocked={this.props.setInputLocked}
            changeCurrentState={this.props.changeCurrentState}
            storeAnswer={this.props.storeAnswer}
            handleEnter={this.handleUpdate}
            ensureSessionExists={this.props.ensureSessionExists}
          />
          <Button bsStyle="link" onClick={handleHide}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.handleUpdate}>
            Update
          </Button>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'editAnswerModal' })(EditAnswerModal);
