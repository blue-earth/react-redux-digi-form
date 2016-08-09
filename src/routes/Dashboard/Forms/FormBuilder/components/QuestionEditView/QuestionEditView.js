import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  ButtonToolbar,
  Collapse,
  Row,
  Col
} from 'react-bootstrap';
import Switch from 'rc-switch';
import QuestionRichTextEditor from '../QuestionRichTextEditor/QuestionRichTextEditor';
import CancelConfirmModal from '../CancelConfirmModal/CancelConfirmModal';
import questionInputs from 'schemas/questionInputs';
import QuestionEditSectionTitle from '../QuestionEditSectionTitle/QuestionEditSectionTitle';
import _ from 'lodash';
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
     * saveForm: Redux action to save the current element being edited and submit form.
     */
    saveForm: PropTypes.func.isRequired,

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
    setQuestionInfo: PropTypes.func.isRequired,

    /*
     * resetQuestionInfo: Redux action to remove a specific item into current question.
     */
    resetQuestionInfo: PropTypes.func.isRequired,

    /*
     * setValidationInfo: Redux action to add or update a specific item in validations array.
     */
    setValidationInfo: PropTypes.func.isRequired,

    /*
     * resetValidationInfo: Redux action to remove a specific item in validations array.
     */
    resetValidationInfo: PropTypes.func.isRequired,

    /*
     * resetMappingInfo: Redux action to remove document mapping info
     */
    resetMappingInfo: PropTypes.func.isRequired,

    /*
     * isModified: Redux state that indicates whether the form is modified since last save or load.
     */
    isModified: PropTypes.bool.isRequired,

    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.setSchema(props.activeInputName);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {
    this.setSchema(props.activeInputName);
  }

  componentDidMount() {

  }

  setSchema(inputName) {
    this.inputSchema = questionInputs[inputName];
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
    const { saveForm } = this.props;
    saveForm();
  }

  setInstruction = (value) => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      'question_instruction': value
    });
  }

  setDescription = (value) => {
    const { setQuestionInfo } = this.props;
    setQuestionInfo({
      'question_description': value
    });
  }

  toggleDescription = (isOn) => {
    const { setQuestionInfo, resetQuestionInfo } = this.props;
    isOn
      ? setQuestionInfo({ 'question_description': '' })
      : resetQuestionInfo('question_description');
  }

  handleMinLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('minLength', value);
  }

  handleMaxLengthChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('maxLength', value);
  }

  handleMinimumChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('minimum', value);
  }

  handleMaximumChange = (event) => {
    const value = _.defaultTo(parseInt(event.target.value), false);
    this.changeValidationValue('maximum', value);
  }

  handleDeleteSelection = (event) => {
    const { resetMappingInfo } = this.props;
    resetMappingInfo();
  }

  handleIsRequiredChange = (isOn) => {
    const { setValidationInfo, resetValidationInfo } = this.props;
    isOn
      ? setValidationInfo({ type: 'isRequired' })
      : resetValidationInfo({ type: 'isRequired' });
  }

  changeValidationValue(type, value) {
    const { setValidationInfo, resetValidationInfo } = this.props;
    value
    ? setValidationInfo({ type, value })
    : resetValidationInfo({ type });
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
    return (
      <h2 className={styles.viewTitle}>
        {this.inputSchema.displayText}
      </h2>
    );
  }

  renderQuestionInstruction() {
    const { currentElement: { question } } = this.props;
    const instruction = _.defaultTo(question.question_instruction, '');
    return (
      <div className={styles.section}>
        <QuestionEditSectionTitle
          title="Question" />
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
        <QuestionEditSectionTitle
          title="Question description"
          popoverId="questionDescription" />
        <div className={styles.sectionSwitchWrapper}>
          <Switch onChange={this.toggleDescription} checked={isDescriptionVisible} />
        </div>
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
            <QuestionEditSectionTitle
              title="Answer output area(s)"
              popoverId="outputArea"
              description="(Leave empty if not required)"
            />
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
    const minLengthNeeded = _.includes(this.inputSchema.validations, 'min_length');
    const maxLengthNeeded = _.includes(this.inputSchema.validations, 'max_length');
    if (!minLengthNeeded && !maxLengthNeeded) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const minLength = _.defaultTo(_.find(validations, { type: 'minLength' }), { value: '' });
    const maxLength = _.defaultTo(_.find(validations, { type: 'maxLength' }), { value: '' });
    return (
      <div className={styles.section}>
        {minLengthNeeded &&
          <Row className={styles.validationRow}>
            <Col xs={8} sm={9}>
              <QuestionEditSectionTitle
                title="Minimum characters"
                popoverId="validationMinLength"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={minLength.value}
                onChange={this.handleMinLengthChange} />
            </Col>
          </Row>
        }
        {maxLengthNeeded &&
          <Row className={styles.validationRow}>
            <Col xs={8} sm={9}>
              <QuestionEditSectionTitle
                title="Maximum characters"
                popoverId="validationMaxLength"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={maxLength.value}
                onChange={this.handleMaxLengthChange} />
            </Col>
          </Row>
        }
      </div>
    );
  }

  renderNumberRangeValidation() {
    const minimumNeeded = _.includes(this.inputSchema.validations, 'minimum');
    const maximumNeeded = _.includes(this.inputSchema.validations, 'maximum');
    if (!minimumNeeded && !maximumNeeded) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const minimum = _.defaultTo(_.find(validations, { type: 'minimum' }), { value: '' });
    const maximum = _.defaultTo(_.find(validations, { type: 'maximum' }), { value: '' });
    return (
      <div className={styles.section}>
        {minimumNeeded &&
          <Row className={styles.validationRow}>
            <Col xs={8} sm={9}>
              <QuestionEditSectionTitle
                title="Minimum value"
                popoverId="validationMinimum"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={minimum.value}
                onChange={this.handleMinimumChange} />
            </Col>
          </Row>
        }
        {maximumNeeded &&
          <Row className={styles.validationRow}>
            <Col xs={8} sm={9}>
              <QuestionEditSectionTitle
                title="Maximum value"
                popoverId="validationMaximum"
                description="(Leave empty if not required)"
              />
            </Col>
            <Col xs={4} sm={3}>
              <input type="number" className={styles.textInput}
                value={maximum.value}
                onChange={this.handleMaximumChange} />
            </Col>
          </Row>
        }
      </div>
    );
  }

  renderIsRequiredValidation() {
    if (!_.includes(this.inputSchema.validations, 'is_required')) return false;
    const validations = _.get(this.props, ['currentElement', 'question', 'validations'], []);
    const isRequired = typeof _.find(validations, { type: 'isRequired' }) !== 'undefined';
    return (
      <div className={styles.section}>
        <Row className={styles.validationRow}>
          <Col xs={8} sm={9}>
            <QuestionEditSectionTitle
              title="Mandatory"
              popoverId="isRequired" />
          </Col>
          <Col xs={4} sm={3}>
            <div className={styles.switchWrapper}>
              <Switch onChange={this.handleIsRequiredChange} checked={isRequired} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderBottomActionButtons() {
    return (
      <div className={styles.bottomActionButtons}>
        <ButtonToolbar className="pull-right">
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleCancel}>Cancel</Button>
          <Button bsStyle="link" bsSize="xsmall" onClick={this.handleSave}>Save</Button>
        </ButtonToolbar>
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
        {this.renderNumberRangeValidation()}
        {this.renderIsRequiredValidation()}
        {this.renderBottomActionButtons()}
        <CancelConfirmModal
          saveElement={saveElement}
          setQuestionEditMode={setQuestionEditMode} />
      </div>
    );
  }
}

export default QuestionEditView;
