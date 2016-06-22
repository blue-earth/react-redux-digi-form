import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import ElementsListView from '../ElementsListView/ElementsListView';
import PageView from '../PageView/PageView';
import QuestionEditView from '../QuestionEditView/QuestionEditView';
import styles from './FormBuilder.scss'

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
     * setActiveInputName: Action to set active input element selected, and enables to draw on the right
     */
    setActiveInputName: PropTypes.func.isRequired,

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
     * pageWidth: Redux state to keep the page zoom ratio.
     */
    pageWidth: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { fetchForm, params: { id } } = this.props;
    if (id) fetchForm(id);
  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {
    // Temporary refresh, should be called after getting response from uploading pdf.
    const { refreshPageWidth, pageWidth } = this.props;
    if (!pageWidth) refreshPageWidth();
  }
  
  resetActiveInputName = () => {
    const { setActiveInputName } = this.props;
    setActiveInputName('');
  }

  render() {
    const { params } = this.props;
    return (
      <div className={styles.formBuilderContainer}>
        <BuilderHeader />
        <div className={styles.formBuilderContent}>
          <div className={styles.leftPanel} onClick={this.resetActiveInputName}>
            {params.id
              ? <QuestionEditView />
              : <ElementsListView {...this.props} />
            }
          </div>
          <div className={styles.rightPanel}>
            <PageView {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default FormBuilder;
