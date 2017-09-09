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
import styles from './EditAnswerModal.scss';

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
    onUpdateAnswer: PropTypes.func,
    ensureSessionExists: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  handleChange = (value) => {
    this.setState({value: value});
  }

  handleUpdateAnswer = () => {
    console.log('EditAnswerModal -> handleUpdateAnswer 1');
    this.refs.questionInteractive.validateAndVerify(
      () => {
        console.log('EditAnswerModal -> handleUpdateAnswer 2');
        this.props.onUpdateAnswer(this.props.question.questionId, this.state.value);
        this.props.handleHide();
      }
    );
  };

  render() {
    const { handleHide, show } = this.props;

    return (
      <Modal show={show} onHide={handleHide}>
        <div className={styles.editQuestionWrapper}>
          <QuestionInteractive
            ref="questionInteractive"
            question={this.props.question}
            value={this.state.value}
            formId={this.props.formId}
            sessionId={this.props.sessionId}
            formTitle={this.props.formTitle}
            isInputLocked={this.props.isInputLocked}
            setInputLocked={this.props.setInputLocked}
            handleChange={this.handleChange}
            handleEnter={this.handleUpdateAnswer}
            ensureSessionExists={this.props.ensureSessionExists}
            isEditAnswerModal
          />
        </div>
        <div className={styles.editFooter}>
          <Button bsStyle="link" onClick={handleHide}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.handleUpdateAnswer}>
            Update
          </Button>
        </div>
      </Modal>
    );
  }
}

export default connectModal({ name: 'editAnswerModal' })(EditAnswerModal);
