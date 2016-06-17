import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INIT_BUILDER_STATE, setActiveInputName, addElement, updateMappingInfo }
  from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  setActiveInputName,
  addElement,
  updateMappingInfo
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
    questions,
    logics,
    documents,
    documentMapping,
    activeInputName,
    currentQuestion
  } = formBuilder || INIT_FORM_STATE;
  return {
    id: parseInt(id),
    isFetching,
    isSubmitting,
    questions,
    logics,
    documents,
    documentMapping,
    activeInputName,
    currentQuestion
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
