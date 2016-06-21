import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INIT_BUILDER_STATE, setActiveInputName, addElement, updateMappingInfo,
  setCurrentQuestionId }
  from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  setActiveInputName,
  addElement,
  updateMappingInfo,
  setCurrentQuestionId
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
    currentQuestionId
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
    currentQuestionId
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
