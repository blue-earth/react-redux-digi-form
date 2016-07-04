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
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * answerChoices: Answer Choices could be used when edit Question.
     */
    answerChoices: PropTypes.array.isRequired,

    /*
     * insertAnswer: Insert Answer into RichTextEditor and remove from dropdown
     */
    insertAnswer: PropTypes.func.isRequired
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
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode(false);
  }

  handleSave = () => {

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
