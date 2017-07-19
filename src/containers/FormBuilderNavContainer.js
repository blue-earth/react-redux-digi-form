import { goTo } from 'redux/modules/router';
import connect from 'redux/utils/connect';
import {
  INIT_BUILDER_STATE,
  setCurrentStep
} from 'redux/modules/formBuilder';
import FormBuilderNav from 'components/FormBuilderNav';

const mapActionCreators = {
  goTo,
  setCurrentStep
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    title,
    currentStep
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    id: parseInt(id),
    title,
    currentStep
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilderNav);
