import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INIT_BUILDER_STATE, setActiveInputName } from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  setActiveInputName
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
}

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    isFetching,
    isSubmitting,
    formData,
    documents,
    activeInputName,
    currentQuestion
  } = formBuilder || INIT_FORM_STATE;
  return {
    id: parseInt(id),
    isFetching,
    isSubmitting,
    formData,
    documents,
    activeInputName,
    currentQuestion
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
