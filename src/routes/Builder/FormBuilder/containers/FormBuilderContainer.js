import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  INIT_BUILDER_STATE,
  fetchForm,
  setActiveInputName,
  addElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  fetchForm,
  setActiveInputName,
  addElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom
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
    currentQuestionId,
    pageZoom,
    pageWidth
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
    currentQuestionId,
    pageZoom,
    pageWidth
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
