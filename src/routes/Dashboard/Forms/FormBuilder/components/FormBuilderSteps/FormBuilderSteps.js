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
        return FormBuilderContainer;
    }
  }

  // TODO: the horizontal navbar with all the step links could probably go in here

  render() {
    var StepComponent = this.currentStepComponent;
    return (
      <StepComponent />
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
