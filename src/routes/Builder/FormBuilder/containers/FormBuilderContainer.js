import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  INIT_BUILDER_STATE,
  fetchForm,
  setActiveInputName,
  addElement,
  deleteElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom,
  setQuestionEditMode,
  insertAnswer
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  fetchForm,
  setActiveInputName,
  addElement,
  deleteElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom,
  setQuestionEditMode,
  insertAnswer
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
    pageZoom,
    pageWidth,
    questionEditMode,
    answerChoices
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
    pageZoom,
    pageWidth,
    questionEditMode,
    answerChoices
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
