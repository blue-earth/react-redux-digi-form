import React, {
  Component,
  PropTypes
} from 'react';
import { formsUrl } from 'helpers/urlHelper';
import FormBuilderContainer from '../../containers/FormBuilderContainer';
// import StepConfigureContainer from '../../containers/StepConfigureContainer';

class FormBuilderSteps extends Component {

  static propTypes = {
    currentStep: PropTypes.string.isRequired,
    /*
     * Form ID
     */
    id: PropTypes.number.isRequired,
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
     * goTo: Redux action to go to specific url.
     */
    goTo: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { newForm, fetchForm, params: { id } } = this.props;
    if (id) {
      fetchForm(id);
    } else {
      newForm();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { id, goTo, params, fetchForm } = this.props;

    // If it was redirected from forms/new, fetchForm again.
    params.id && !prevProps.params.id && !id && fetchForm(params.id);

    // If it was in forms/new and received id from Upload modal, redirects to {:formId}/edit
    // TODO: test this
    id && !params.id && goTo(formsUrl(`/${id}/edit`));
  }

  // TODO: make the real step components
  get currentStepComponent() {
    switch (this.props.currentStep) {
      case 'arrange':
        return TempStepArrange;
      case 'configure':
        return TempStepConfigure;
      case 'send':
        return TempStepSend;
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
            activeInputName: props.activeInputName,
            setActiveInputName: props.setActiveInputName,
            saveElement: props.saveElement,
            saveForm: props.saveForm,
            currentElement: props.currentElement,
            setQuestionInfo: props.setQuestionInfo,
            resetQuestionInfo: props.resetQuestionInfo,
            setValidationInfo: props.setValidationInfo,
            resetValidationInfo: props.resetValidationInfo,
            setMappingInfo: props.setMappingInfo,
            setMappingPositionInfo: props.setMappingPositionInfo,
            resetMappingInfo: props.resetMappingInfo,
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

  // TODO: the horizontal navbar with all the step links could probably go in here

  render() {
    const { Component, props } = this.currentStepComponent;
    return (
      <Component {...props} />
    );
  }
}

export default FormBuilderSteps;

// temporary components for the remaining steps, just for testing navigation
class TempStepArrange extends Component {
  render() {
    return (
      <div>Arrange</div>
    );
  }
}

class TempStepConfigure extends Component {
  render() {
    return (
      <div>Configure</div>
    );
  }
}

class TempStepSend extends Component {
  render() {
    return (
      <div>Send</div>
    );
  }
}
