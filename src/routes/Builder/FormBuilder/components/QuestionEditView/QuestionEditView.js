import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import styles from './QuestionEditView.scss';

class QuestionEditView extends Component {

  static propTypes = {
    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * deleteElement: used to set active input element selected, and enables to draw on the right
     */
    deleteElement: PropTypes.func.isRequired,

    /*
     * editElement: used to edit instruction of active input element selected
     */
    editElement: PropTypes.func.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

    /*
     * currentQuestionInstruction: Redux state to specify the active input instruction.
     */
    currentQuestionInstruction: PropTypes.string.isRequired

  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  handlePreview = () => {

  }

  handleDelete = () => {
    const { deleteElement, currentQuestionId } = this.props;
    deleteElement(currentQuestionId);
  }

  handleReset = () => {

  }

  handleCancel = () => {
    const { setQuestionEditMode, currentQuestionId } = this.props;
    setQuestionEditMode({
      id: currentQuestionId,
      mode: false
    });
  }

  handleSave = () => {
    const { editElement, currentQuestionId, currentQuestionInstruction } = this.props;
    editElement(currentQuestionId, currentQuestionInstruction);
  }

  renderTopActionButtons() {
    return (
      <div className={styles.topActionButtons}>
        <Button bsStyle="link" onClick={this.handlePreview}>Preview</Button>
        <Button bsStyle="link" onClick={this.handleDelete}>Delete</Button>
        <Button bsStyle="link" onClick={this.handleReset}>Reset</Button>
        <Button bsStyle="link" onClick={this.handleCancel}>Cancel</Button>
        <Button bsStyle="link" onClick={this.handleSave}>Save</Button>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.questionEditView}>
        {this.renderTopActionButtons()}
        {'Question Edit View'}
        <QuestionRichTextEditor {...this.props} />
      </div>
    );
  }
}

export default QuestionEditView;
