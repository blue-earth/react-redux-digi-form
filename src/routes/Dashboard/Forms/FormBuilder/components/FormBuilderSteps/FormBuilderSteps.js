import React, {
  Component,
  PropTypes
} from 'react';
import FormBuilder from '../../containers/FormBuilderContainer';

class FormBuilderSteps extends Component {

  static propTypes = {
    currentStep: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired
  };

  // TODO: make the real step components
  get currentStepComponent() {
    const { props } = this;
    switch (props.currentStep) {
      case 'arrange':
        return TempStepArrange;
      case 'configure':
        return TempStepConfigure;
      case 'send':
        return TempStepSend;
      default:
        return FormBuilder;
    }
  }

  // TODO: the horizontal navbar with all the step links could probably go in here

  render() {
    const { params } = this.props;
    const Component = this.currentStepComponent;
    return (
      <Component params={params} />
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
