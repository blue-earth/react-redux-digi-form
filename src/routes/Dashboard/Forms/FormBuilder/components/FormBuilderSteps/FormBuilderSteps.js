import React, {
  Component,
  PropTypes
} from 'react';
import FormBuilder from '../FormBuilder';
import StepConfigure from '../StepConfigure';
import StepPublish from '../StepPublish';

class FormBuilderSteps extends Component {

  static propTypes = {
    currentStep: PropTypes.string.isRequired,
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    status: PropTypes.number,
    subdomain: PropTypes.string,

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

    formConfig: PropTypes.object,

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
    setCurrentElement: PropTypes.func.isRequired,
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

    resetMappingInfo: PropTypes.func.isRequired,

    /*
     * setMappingPositionInfo: Action to update the document mapping position info of active selection.
     */
    setMappingPositionInfo: PropTypes.func.isRequired,

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
    questionEditMode: PropTypes.number.isRequired,

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
    goTo: PropTypes.func.isRequired,

    submitConfigureStep: PropTypes.func,
    submitPublishStep: PropTypes.func,

    setFormStatus: PropTypes.func
  };

  get currentStepComponent() {
    const props = this.props;
    switch (props.currentStep) {
      case 'arrange':
        return {
          Component: TempStepArrange,
          props: props
        };
      case 'configure':
        return {
          Component: StepConfigure,
          props: {
            id: props.id,
            title: props.title,
            slug: props.slug,
            subdomain: props.subdomain,
            questions: props.questions,
            formConfig: props.formConfig,
            submitConfigureStep: props.submitConfigureStep
          }
        };
      case 'publish':
        return {
          Component: StepPublish,
          props: {
            id: props.id,
            title: props.title,
            slug: props.slug,
            status: props.status,
            subdomain: props.subdomain,
            setFormStatus: props.setFormStatus,
            submitPublishStep: props.submitPublishStep
          }
        };
      default:
        return {
          Component: FormBuilder,
          props: {
            id: props.id,
            questions: props.questions,
            logics: props.logics,
            documents: props.documents,
            documentMapping: props.documentMapping,
            isFetching: props.isFetching,
            isSubmitting: props.isSubmitting,
            isModified: props.isModified,
            saveElement: props.saveElement,
            saveForm: props.saveForm,
            currentElement: props.currentElement,
            setCurrentElement: props.setCurrentElement,
            deleteElement: props.deleteElement,
            setActiveBox: props.setActiveBox,
            setQuestionInfo: props.setQuestionInfo,
            resetQuestionInfo: props.resetQuestionInfo,
            setValidationInfo: props.setValidationInfo,
            resetValidationInfo: props.resetValidationInfo,
            setMappingInfo: props.setMappingInfo,
            resetMappingInfo: props.resetMappingInfo,
            setMappingPositionInfo: props.setMappingPositionInfo,
            pageZoom: props.pageZoom,
            setPageZoom: props.setPageZoom,
            questionEditMode: props.questionEditMode,
            setQuestionEditMode: props.setQuestionEditMode,
            newForm: props.newForm,
            fetchForm: props.fetchForm,
            params: props.params,
            show: props.show,
            goTo: props.goTo
          }
        };
    }
  }

  render() {
    const { Component, props } = this.currentStepComponent;
    return (
      <Component {...props} />
    );
  }
}

export default FormBuilderSteps;

// TODO: replace these temporary components with the real ones
class TempStepArrange extends Component {
  render() {
    return (
      <div>Arrange</div>
    );
  }
}
