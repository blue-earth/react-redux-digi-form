import React, {
  Component,
  PropTypes
} from 'react';
import {
  Nav,
  NavItem,
  Tab
} from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import AnswerOutputArea from 'components/QuestionEditFields/AnswerOutputArea';
import InstructionDescription from 'components/QuestionEditFields/InstructionDescription';
import LengthValidation from 'components/QuestionEditFields/LengthValidation';
import RangeValidation from 'components/QuestionEditFields/RangeValidation';
import RequiredValidation from 'components/QuestionEditFields/RequiredValidation';
import MultipleSelection from 'components/QuestionEditFields/MultipleSelection';
import questionInputs from 'schemas/questionInputs';
import _ from 'lodash';
import 'rc-switch/assets/index.css';
import styles from './QuestionEditPanel.scss';

export default class QuestionEditPanel extends Component {

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
    const { setQuestionEditMode, show, currentElement } = this.props;
    if (currentElement.isModified) {
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

  renderViewHeader() {
    return (
      <div className={styles.viewHeader}>
        <h2>{this.inputSchema.displayText}</h2>
        <Nav bsStyle="tabs" className="mainTabs">
          <NavItem eventKey="general">General</NavItem>
          <NavItem eventKey="advanced">Advanced</NavItem>
        </Nav>
      </div>
    );
  }

  renderViewFooter() {
    return (
      <ul className={styles.viewFooter}>
        <li className="pull-left">
          <Button onClick={this.handleCancel} style="linkButton">
            Cancel
          </Button>
        </li>
        <li className="pull-right">
          <Button onClick={this.handleSave} className={styles.saveButton}>
            Save &amp; continue
          </Button>
        </li>
      </ul>
    );
  }

  render() {
    const componentProps = _.merge({}, this.props, {
      inputSchema: this.inputSchema
    });
    return (
      <Tab.Container defaultActiveKey="general">
        <div className={styles.questionEditView}>
          {this.renderViewHeader()}
          <Tab.Content animation>
            <Tab.Pane eventKey="general">
              <div className={styles.viewBody}>
                <InstructionDescription {...componentProps} />
                <AnswerOutputArea {...componentProps} />
                <LengthValidation {...componentProps} />
                <RangeValidation {...componentProps} />
                <RequiredValidation {...componentProps} />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="advanced">
              <div className={styles.viewBody}>
                <MultipleSelection {...componentProps} />
              </div>
            </Tab.Pane>
          </Tab.Content>
          {this.renderViewFooter()}
        </div>
      </Tab.Container>
    );
  }
}

