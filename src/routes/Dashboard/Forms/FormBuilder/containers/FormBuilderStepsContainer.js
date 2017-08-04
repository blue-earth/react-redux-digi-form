import connect from 'redux/utils/connect';
import {
  INIT_BUILDER_STATE
} from 'redux/modules/formBuilder';

import FormBuilderSteps from '../components/FormBuilderSteps';

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    currentStep
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    currentStep
  };
};

export default connect(mapStateToProps)(FormBuilderSteps);
