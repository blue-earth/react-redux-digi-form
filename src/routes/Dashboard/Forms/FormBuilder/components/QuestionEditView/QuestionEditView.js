import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  ButtonToolbar,
  Popover,
  OverlayTrigger,
  Collapse,
  Row,
  Col
} from 'react-bootstrap';
import { MdHelpOutline } from 'react-icons/lib/md';
import Switch from 'rc-switch';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import CancelConfirmModal from '../CancelConfirmModal/CancelConfirmModal';
import questionInputs from 'schemas/questionInputs';
import _ from 'lodash';
import popoverTexts from './PopoverTexts';
import 'rc-switch/assets/index.css';
import styles from './QuestionEditView.scss';

class QuestionEditView extends Component {

  static propTypes = {
    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

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
    updateQuestionInfo: PropTypes.func.isRequired,

    /*
     * resetMappingInfo: Redux action to remove document mapping info
     */
    resetMappingInfo: PropTypes.func.isRequired,

    /*
     * updateValidationInfo: Redux action to update validations array.
     */
    updateValidationInfo: PropTypes.func.isRequired,

    /*
     * isModified: Redux state that indicates whether the form is modified since last save or load.
     */
    isModified: PropTypes.bool.isRequired,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired
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
    const { setQuestionEditMode, show, isModified } = this.props;
    if (isModified) {
      show('cancelConfirmModal');
    } else {
      setQuestionEditMode({
        mode: false
      });
    }
  }

  handleSave = () => {
    const { saveElement } = this.props;
    saveElement();
  }

  setInstruction = (value) => {
    const { updateQuestionInfo } = this.props;
    updateQuestionInfo({
      'question_instruction': value
    });
  }

  setDescription = (value) => {
    const { updateQuestionInfo } = this.props;
    updateQuestionInfo({
      'question_description': value
    });
  }

  toggleDescription = (isOn) => {
    const { updateQuestionInfo } = this.props;
    updateQuestionInfo({ 'question_description': (isOn ? '' : undefined) });
  }

  handleMinLengthChange = (event) => {
    const { updateValidationInfo } = this.props;
    const value = _.defaultTo(parseInt(event.target.value), undefined);
    updateValidationInfo({
      type: 'minLength',
      value
    });
  }

  handleMaxLengthChange = (event) => {
    const { updateValidationInfo } = this.props;
    const value = _.defaultTo(parseInt(event.target.value), undefined);
    updateValidationInfo({
      type: 'maxLength',
      value
    });
  }

  handleDeleteSelection = (event) => {
    const { resetMappingInfo } = this.props;
    resetMappingInfo();
  }

  getPopover(popoverId) {
    return (
      <Popover id={`${popoverId}Popover`}>
        {popoverTexts[popoverId]}
      </Popover>
    );
  }

  get questionsList() {
    const { questions, currentElement } = this.props;
    const filteredQuestions = currentElement.id
      ? _.differenceBy(questions, [{id: currentElement.id}], 'id')
      : questions;
    return filteredQuestions.map(item => ({
      key: `answer_${item.id}`,
      text: `answer_${item.id}`
    }));
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
        <div className={styles.textEditorWrapper}>
          <QuestionRichTextEditor
            value={instruction}
            setValue={this.setInstruction}
            questions={this.questionsList}
          />
        </div>
      </div>
    );
  }

  renderQuestionDescription() {
    const { currentElement: { question } } = this.props;
    const description = _.defaultTo(question.question_description, '');
    const isDescriptionVisible = typeof question.question_description !== 'undefined';
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Question description
          <OverlayTrigger trigger="focus" overlay={this.getPopover('questionDescription')}>
            <span tabIndex={0} className={styles.popoverIcon}>
              <MdHelpOutline size={18} />
            </span>
          </OverlayTrigger>
          <div className={styles.switchWrapper}>
            <Switch onChange={this.toggleDescription} checked={isDescriptionVisible} />
          </div>
        </h3>
        <Collapse in={isDescriptionVisible}>
          <div className={styles.textEditorWrapper}>
            <QuestionRichTextEditor
              value={description}
              setValue={this.setDescription}
              questions={this.questionsList}
            />
          </div>
        </Collapse>
      </div>
    );
  }

  renderAnswerOutputArea() {
    return (
      <div className={styles.section}>
        <Row className={styles.validationRow}>
          <Col xs={6}>
            <h3 className={styles.sectionTitle}>
              Answer output area(s)
              <OverlayTrigger trigger="focus" overlay={this.getPopover('outputArea')}>
                <span tabIndex={0} className={styles.popoverIcon}>
                  <MdHelpOutline size={18} />
                </span>
              </OverlayTrigger>
            </h3>
            <p className={styles.titleDescription}>(Leave empty if not required)</p>
          </Col>
          <Col xs={6}>
            <Button block bsSize="small" onClick={this.handleDeleteSelection}>
              Delete all output selections
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  renderLengthValidation() {
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const minLength = _.defaultTo(_.find(validations, { type: 'minLength' }), { value: '' });
    const maxLength = _.defaultTo(_.find(validations, { type: 'maxLength' }), { value: '' });
    return (
      <div className={styles.section}>
        <Row className={styles.validationRow}>
          <Col xs={8} sm={9}>
            <h3 className={styles.sectionTitle}>
              Minimum characters
              <OverlayTrigger trigger="focus" overlay={this.getPopover('validationMinLength')}>
                <span tabIndex={0} className={styles.popoverIcon}>
                  <MdHelpOutline size={18} />
                </span>
              </OverlayTrigger>
            </h3>
            <p className={styles.titleDescription}>(Leave empty if not required)</p>
          </Col>
          <Col xs={4} sm={3}>
            <input type="number" className={styles.textInput}
              value={minLength.value}
              onChange={this.handleMinLengthChange} />
          </Col>
        </Row>
        <Row className={styles.validationRow}>
          <Col xs={8} sm={9}>
            <h3 className={styles.sectionTitle}>
              Maximum characters
              <OverlayTrigger trigger="focus" overlay={this.getPopover('validationMaxLength')}>
                <span tabIndex={0} className={styles.popoverIcon}>
                  <MdHelpOutline size={18} />
                </span>
              </OverlayTrigger>
            </h3>
            <p className={styles.titleDescription}>(Leave eptmy if not required)</p>
          </Col>
          <Col xs={4} sm={3}>
            <input type="number" className={styles.textInput}
              value={maxLength.value}
              onChange={this.handleMaxLengthChange} />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { saveElement, setQuestionEditMode } = this.props;
    return (
      <div className={styles.questionEditView}>
        {this.renderTopActionButtons()}
        {this.renderViewTitle()}
        <hr className={styles.separator} />
        {this.renderQuestionInstruction()}
        {this.renderQuestionDescription()}
        {this.renderAnswerOutputArea()}
        {this.renderLengthValidation()}
        <CancelConfirmModal
          saveElement={saveElement}
          setQuestionEditMode={setQuestionEditMode} />
      </div>
    );
  }
}

export default QuestionEditView;
