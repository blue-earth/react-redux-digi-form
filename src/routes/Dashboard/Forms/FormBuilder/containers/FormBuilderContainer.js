import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  INIT_BUILDER_STATE,
  newForm,
  fetchForm,
  saveForm,
  setQuestionEditMode,
  setActiveInputName,
  setQuestionInfo,
  resetQuestionInfo,
  setValidationInfo,
  resetValidationInfo,
  setMappingInfo,
  resetMappingInfo,
  setPageZoom,
  saveElement,
  deleteElement
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  newForm,
  fetchForm,
  saveForm,
  setQuestionEditMode,
  setActiveInputName,
  setQuestionInfo,
  resetQuestionInfo,
  setValidationInfo,
  resetValidationInfo,
  setMappingInfo,
  resetMappingInfo,
  setPageZoom,
  saveElement,
  deleteElement,
  show
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    currentElement,
    activeInputName,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    id: parseInt(id),
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    currentElement,
    activeInputName,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilder);
