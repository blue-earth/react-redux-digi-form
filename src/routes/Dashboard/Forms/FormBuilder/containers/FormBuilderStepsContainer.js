import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import { goTo } from 'redux/modules/router';
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
  setMappingPositionInfo,
  setPageZoom,
  saveElement,
  deleteElement,
  setCurrentElement,
  setActiveBox,
  processSubmitConfigure
} from 'redux/modules/formBuilder';

import FormBuilderSteps from '../components/FormBuilderSteps';

const mapActionCreators = {
  newForm,
  fetchForm,
  goTo,
  saveForm,
  setQuestionEditMode,
  setActiveInputName,
  setQuestionInfo,
  resetQuestionInfo,
  setValidationInfo,
  resetValidationInfo,
  setMappingInfo,
  setMappingPositionInfo,
  setPageZoom,
  saveElement,
  deleteElement,
  setCurrentElement,
  setActiveBox,
  processSubmitConfigure,
  show
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    title,
    slug,
    subdomain,
    currentStep,
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    formConfig,
    currentElement,
    activeInputName,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  } = formBuilder || INIT_BUILDER_STATE;
  return {
    id: parseInt(id),
    title,
    slug,
    subdomain,
    currentStep,
    isFetching,
    isSubmitting,
    isModified,
    questions,
    logics,
    documents,
    documentMapping,
    formConfig,
    currentElement,
    activeInputName,
    currentQuestionInstruction,
    pageZoom,
    pageWidth,
    questionEditMode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormBuilderSteps);
