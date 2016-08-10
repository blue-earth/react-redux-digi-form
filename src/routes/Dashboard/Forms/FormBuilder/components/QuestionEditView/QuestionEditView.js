import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  ButtonToolbar
} from 'react-bootstrap';
import CancelConfirmModal from '../CancelConfirmModal/CancelConfirmModal';
import AnswerOutputArea from 'components/QuestionEditFields/AnswerOutputArea/AnswerOutputArea';
import Instruction from 'components/QuestionEditFields/Instruction/Instruction';
import Description from 'components/QuestionEditFields/Description/Description';
import LengthValidation from 'components/QuestionEditFields/LengthValidation/LengthValidation';
import RangeValidation from 'components/QuestionEditFields/RangeValidation/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation/RequiredValidation';
import questionInputs from 'schemas/questionInputs';
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
    const componentProps = _.merge({}, this.props, {
      questions: this.questionsList,
      inputSchema: this.inputSchema
    });
    return (
      <div className={styles.questionEditView}>
        {this.renderTopActionButtons()}
        {this.renderViewTitle()}
        <hr className={styles.separator} />
        <Instruction {...componentProps} />
        <Description {...componentProps} />
        <AnswerOutputArea {...componentProps} />
        <LengthValidation {...componentProps} />
        <RangeValidation {...componentProps} />
        <RequiredValidation {...componentProps} />
        {this.renderBottomActionButtons()}
        <CancelConfirmModal
          saveElement={saveElement}
          setQuestionEditMode={setQuestionEditMode} />
      </div>
    );
  }
}

export default QuestionEditView;
