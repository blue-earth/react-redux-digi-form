import React, {
  Component,
  PropTypes
} from 'react';
import ElementsListView from '../ElementsListView/ElementsListView';
import PageView from '../PageView/PageView';
import QuestionEditView from '../QuestionEditView/QuestionEditView';
import styles from './FormBuilder.scss';

class FormBuilder extends Component {

  static propTypes = {
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,

    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

    /*
     * logics: Redux state to store the array of logics.
     */
    logics: PropTypes.array.isRequired,

    /*
     * documents: Redux state to store the array of documents with image url.
     */
    documents: PropTypes.array,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.array.isRequired,

    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * isVerifying: Redux state that indicates the status whether the form is being submitted
     */
    isSubmitting: PropTypes.bool.isRequired,

    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * setCurrentQuestionInstruction: Action to set instruction of active input element selected
     */
    setCurrentQuestionInstruction: PropTypes.func.isRequired,

    /*
     * setActiveInputName: Action to set active input element selected, and enables to draw on the right
     */
    setActiveInputName: PropTypes.func.isRequired,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * setCurrentQuestionId: Redux action to set the current active question ID.
     */
    setCurrentQuestionId: PropTypes.func.isRequired,

    /*
     * addElement: Action to set active input element selected, and enables to draw on the right
     */
    addElement: PropTypes.func.isRequired,

    /*
     * updateMappingInfo: Action to update the document mapping info.
     */
    updateMappingInfo: PropTypes.func.isRequired,

    /*
     * pageZoom: Redux state to keep the page zoom ratio.
     */
    pageZoom: PropTypes.number.isRequired,

    /*
     * setPageZoom: Redux action to set page zoom ratio.
     */
    setPageZoom: PropTypes.func.isRequired,

    /*
     * questionEditMode: Redux state to indicate question edit mode
     */
    questionEditMode: PropTypes.bool.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * newForm: Redux action to reset form with initial state for new form
     */
    newForm: PropTypes.func.isRequired,

    /*
     * fetchForm: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchForm: PropTypes.func.isRequired,

    params: PropTypes.object
  };

  componentWillMount() {
    const { newForm, fetchForm, params: { id } } = this.props;
    if (id) {
      fetchForm(id);
    } else {
      newForm();
    }
  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {
  }

  resetActiveInputName = () => {
    const { setActiveInputName } = this.props;
    setActiveInputName('');
  }

  render() {
    const { questionEditMode, currentQuestionId } = this.props;
    return (
      <div className={styles.formBuilderContainer}>
        <div className={styles.leftPanel} onClick={this.resetActiveInputName}>
          {questionEditMode && currentQuestionId
            ? <QuestionEditView {...this.props} />
            : <ElementsListView {...this.props} />
          }
        </div>
        <div className={styles.rightPanel}>
          <PageView {...this.props} />
        </div>
      </div>
    );
  }
}

export default FormBuilder;
