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
import MultipleSelection from 'components/QuestionEditFields/MultipleSelection';
import questionInputs from 'schemas/questionInputs';
import _ from 'lodash';
import 'rc-switch/assets/index.css';
import { formBuilderSelectMode } from 'constants/formBuilder';
import styles from './QuestionEditPanel.scss';
import { getQuestionTypeConfigComponent } from '../QuestionEditConfigSidebar';

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
     * setCurrentElement: Redux action to set/load currentElement
     */
    setCurrentElement: PropTypes.func.isRequired,

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
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.setSchema(props.currentElement.question.type);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {
    this.setSchema(props.currentElement.question.type);
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
    const { setCurrentElement, setQuestionEditMode, show, currentElement } = this.props;
    if (currentElement.isModified) {
      show('cancelConfirmModal');
    } else {
      setQuestionEditMode(formBuilderSelectMode.QUESTION_TYPE_LIST_VIEW);
      setCurrentElement(null);
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

    var questionType = this.props.currentElement.question.type;
    return (
      <Tab.Container defaultActiveKey="general" id="question-edit-panel">
        <div className={styles.questionEditView}>
          {this.renderViewHeader()}
          <Tab.Content animation>
            <Tab.Pane eventKey="general">
              <div className={styles.viewBody}>
                {getQuestionTypeConfigComponent(questionType, 'general', componentProps)}
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="advanced">
              <div className={styles.viewBody}>
                {getQuestionTypeConfigComponent(questionType, 'advanced', componentProps)}
              </div>
            </Tab.Pane>
          </Tab.Content>
          {this.renderViewFooter()}
        </div>
      </Tab.Container>
    );
  }
}
