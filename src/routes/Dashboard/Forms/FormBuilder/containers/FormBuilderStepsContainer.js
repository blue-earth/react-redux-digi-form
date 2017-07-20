import connect from 'redux/utils/connect';
import { goTo } from 'redux/modules/router';
import {
  INIT_BUILDER_STATE,
  newForm,
  fetchForm
} from 'redux/modules/formBuilder';

import FormBuilderSteps from '../components/FormBuilderSteps';

const mapActionCreators = {
  newForm,
  fetchForm,
  goTo
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    currentStep,
    id
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    currentStep,
    id: parseInt(id)
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilderSteps);
