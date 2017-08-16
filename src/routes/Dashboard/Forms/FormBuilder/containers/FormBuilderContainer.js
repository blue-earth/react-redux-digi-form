import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import { goTo } from 'redux/modules/router';
import {
  INIT_BUILDER_STATE,
  newForm,
  fetchForm,
  saveForm,
  setQuestionEditMode,
  setQuestionInfo,
  resetQuestionInfo,
  setValidationInfo,
  resetValidationInfo,
  setMappingInfo,
  setMappingPositionInfo,
  setPageZoom,
  saveElement,
  setActiveBox,
  deleteElement,
  setCurrentElement
} from 'redux/modules/formBuilder';

import FormBuilder from '../components/FormBuilder';

const mapActionCreators = {
  newForm,
  fetchForm,
  goTo,
  saveForm,
  setQuestionEditMode,
  setQuestionInfo,
  resetQuestionInfo,
  setValidationInfo,
  resetValidationInfo,
  setMappingInfo,
  setMappingPositionInfo,
  setPageZoom,
  saveElement,
  setActiveBox,
  deleteElement,
  show,
  setCurrentElement
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    currentStep,
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    currentElement,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode,
    activeBoxPath
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    id: parseInt(id),
    currentStep,
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    currentElement,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode,
    activeBoxPath
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilder);
