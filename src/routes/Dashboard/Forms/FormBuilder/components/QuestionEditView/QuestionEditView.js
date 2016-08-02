import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import { MdHelpOutline } from 'react-icons/lib/md';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import questionInputs from 'schemas/questionInputs';
import _ from 'lodash';
import styles from './QuestionEditView.scss';

class QuestionEditView extends Component {

  static propTypes = {
    /*
     * deleteElement: used to set active input element selected, and enables to draw on the right
     */
    deleteElement: PropTypes.func.isRequired,

    /*
     * saveElement: Redux action to save the current element being edited.
     */
    saveElement: PropTypes.func.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * currentElement: Redux state to store the state of the element being edited currently.
     */
    currentElement: PropTypes.object.isRequired,

    /*
     * currentQuestionInstruction: Redux state to specify the active input instruction.
     */
    updateQuestionInfo: PropTypes.func.isRequired
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
    const { deleteElement, currentElement } = this.props;
    currentElement && deleteElement(currentElement.id);
  }

  handleReset = () => {

  }

  handleCancel = () => {
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode({
      mode: false
    });
  }

  handleSave = () => {
    const { saveElement } = this.props;
    saveElement();
  }

  setInstruction = (value) => {
    const { updateQuestionInfo } = this.props;
    updateQuestionInfo({
      instruction: value
    });
  }

  setDescription = (value) => {
    const { updateQuestionInfo } = this.props;
    updateQuestionInfo({
      description: value
    });
  }

  renderTopActionButtons() {
    return (
      <div className={styles.topActionButtons}>
        <ButtonToolbar className="pull-right">
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handlePreview}>Preview</Button>
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleDelete}>Delete</Button>
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleReset}>Reset</Button>
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleCancel}>Cancel</Button>
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleSave}>Save</Button>
        </ButtonToolbar>
      </div>
    );
  }

  renderViewTitle() {
    const { currentElement: { question } } = this.props;
    const inputType = _.find(questionInputs, { name: question.type });
    return (
      <h2 className={styles.viewTitle}>
        {inputType.displayText}
      </h2>
    );
  }

  renderQuestionInstruction() {
    const { currentElement: { question } } = this.props;
    const instruction = _.defaultTo(question.question_instruction, '');
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Question
        </h3>
        <QuestionRichTextEditor
          value={instruction}
          setValue={this.setInstruction}
        />
      </div>
    );
  }

  get descriptionPopover() {
    return (
      <Popover id="questionDescriptionPopover">
        TODO: Add question description popover text here.
      </Popover>
    );
  }

  renderQuestionDescription() {
    const { currentElement: { question } } = this.props;
    const description = _.defaultTo(question.question_description, '');
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Question description
          <OverlayTrigger trigger="focus" overlay={this.descriptionPopover}>
            <span tabIndex={0} className={styles.popoverIcon}>
              <MdHelpOutline size={18} />
            </span>
          </OverlayTrigger>
        </h3>
        <QuestionRichTextEditor
          value={description}
          setValue={this.setDescription}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={styles.questionEditView}>
        {this.renderTopActionButtons()}
        {this.renderViewTitle()}
        <hr className={styles.separator} />
        {this.renderQuestionInstruction()}
        <hr className={styles.separator} />
        {this.renderQuestionDescription()}
      </div>
    );
  }
}

export default QuestionEditView;
