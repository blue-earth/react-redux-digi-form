import connect from 'redux/utils/connect';
import {
  INIT_BUILDER_STATE,
  newForm,
  fetchForm,
  setQuestionEditMode,
  setActiveInputName,
  updateQuestionInfo,
  updateMappingInfo,
  setPageZoom,
  saveElement,
  deleteElement,
  setCurrentQuestionId
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  newForm,
  fetchForm,
  setActiveInputName,
  updateQuestionInfo,
  saveElement,
  deleteElement,
  updateMappingInfo,
  setCurrentQuestionId,
  setPageZoom,
  setQuestionEditMode
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
    currentElement,
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
    currentElement,
    activeInputName,
    currentQuestionId,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilder);
