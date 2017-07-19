import React, {
  Component,
  PropTypes
} from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';
import { formsUrl } from 'helpers/urlHelper';
import classNames from 'classnames';
import ElementsListPanel from '../ElementsListPanel';
import PageView from '../PageView';
import QuestionEditPanel from '../QuestionEditPanel';
import CancelConfirmModal from '../CancelConfirmModal';
import UploadModal from '../UploadModal';
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
    documentMapping: PropTypes.object.isRequired,

    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * isVerifying: Redux state that indicates the status whether the form is being submitted
     */
    isSubmitting: PropTypes.bool.isRequired,

    /*
     * isModified: Redux state that indicates whether the form is modified since last save or load.
     */
    isModified: PropTypes.bool.isRequired,

    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * setActiveInputName: Action to set active input element selected, and enables to draw on the right
     */
    setActiveInputName: PropTypes.func.isRequired,

    /*
     * saveElement: Redux action to save the current element being edited.
     */
    saveElement: PropTypes.func.isRequired,

    /*
     * saveForm: Redux action to save the current element being edited and submit form.
     */
    saveForm: PropTypes.func.isRequired,

    /*
     * currentElement: Redux state to hold the element currently being edited.
     */
    currentElement: PropTypes.object,

    /*
     * setQuestionInfo: Redux action to add or update a specific item into current question.
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
     * setMappingInfo: Action to update the document mapping info.
     */
    setMappingInfo: PropTypes.func.isRequired,

    /*
     * setMappingPositionInfo: Action to update the document mapping position info of active selection.
     */
    setMappingPositionInfo: PropTypes.func.isRequired,

    /*
     * resetMappingInfo: Redux action to remove document mapping info
     */
    resetMappingInfo: PropTypes.func.isRequired,

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
     * setQuestionEditMode: Redux action to set question edit mode.
     * If id is specified, enters into existing question edit mode.
     * If id is not specified, enters into new question edit mode.
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

    /*
     * params: URL params
     */
    params: PropTypes.object,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired,

    /*
     * goTo: Redux action to go to specific url.
     */
    goTo: PropTypes.func.isRequired
  };

  componentWillMount() {
  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {
    const { newForm, fetchForm, params: { id }, show } = this.props;
    if (id) {
      fetchForm(id);
    } else {
      newForm();
      show('uploadModal');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { id, goTo, params, fetchForm, documents, show } = this.props;

    // If it was redirected from forms/new, fetchForm again.
    params.id && !prevProps.params.id && !id && fetchForm(params.id);

    // If it was in forms/new and received id from Upload modal, redirects to {:formId}/edit
    id && !params.id && goTo(formsUrl(`/${id}/edit`));

    // If no document image loaded, show Upload modal.
    if (id && documents.length === 0) {
      show('uploadModal', { formId: id });
    }
  }

  resetActiveInputName = () => {
    const { setActiveInputName } = this.props;
    setActiveInputName('');
  }

  render() {
    const { saveElement, setQuestionEditMode, questionEditMode } = this.props;
    const leftPanelClass = classNames({
      [styles.leftPanel]: true,
      [styles.open]: questionEditMode
    });
    const rightPanelClass = classNames({
      [styles.rightPanel]: true,
      [styles.open]: questionEditMode
    });
    return (
      <Row className={styles.formBuilderContainer}>
        <Col sm={4} className={leftPanelClass}>
          {questionEditMode
            ? <QuestionEditPanel {...this.props} />
            : <ElementsListPanel {...this.props} />
          }
        </Col>
        <Col sm={8} className={rightPanelClass}>
          <PageView {...this.props} />
        </Col>
        <UploadModal {...this.props} />
        <CancelConfirmModal
          saveElement={saveElement}
          setQuestionEditMode={setQuestionEditMode} />
      </Row>
    );
  }
}

export default FormBuilder;
