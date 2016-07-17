import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  INIT_BUILDER_STATE,
  newForm,
  fetchForm,
  setActiveInputName,
  setCurrentQuestionInstruction,
  editElement,
  addElement,
  deleteElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom,
  setQuestionEditMode
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  newForm,
  fetchForm,
  setActiveInputName,
  setCurrentQuestionInstruction,
  editElement,
  addElement,
  deleteElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom,
  setQuestionEditMode
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
};

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
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  } = formBuilder || INIT_BUILDER_STATE;
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
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
