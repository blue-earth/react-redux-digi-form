import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import { goTo } from 'redux/modules/router';
import {
  INIT_BUILDER_STATE,
  addNewGroup,
  deleteElement,
  deleteGroup,
  deleteMappingInfoByPath,
  fetchForm,
  newForm,
  resetQuestionInfo,
  resetValidationInfo,
  saveElement,
  saveForm,
  setActiveBox,
  setActiveLabel,
  setBuilderState,
  setCurrentElement,
  setFormStatus,
  setMappingPositionInfo,
  setPageZoom,
  setQuestionEditMode,
  setQuestionInfo,
  setValidationInfo,
  submitConfigureStep,
  submitForm,
  submitPublishStep,
  updateGroup
} from 'redux/modules/formBuilder';

import FormBuilderSteps from '../components/FormBuilderSteps';

const mapActionCreators = {
  addNewGroup,
  deleteElement,
  deleteGroup,
  deleteMappingInfoByPath,
  fetchForm,
  goTo,
  newForm,
  resetQuestionInfo,
  resetValidationInfo,
  saveElement,
  saveForm,
  setActiveBox,
  setActiveLabel,
  setBuilderState,
  setCurrentElement,
  setFormStatus,
  setMappingPositionInfo,
  setPageZoom,
  setQuestionEditMode,
  setQuestionInfo,
  setValidationInfo,
  show,
  submitConfigureStep,
  submitForm,
  submitPublishStep,
  updateGroup
};

const mapStateToProps = (state) => {
  const { formBuilder } = state;
  const {
    id,
    title,
    slug,
    status,
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
    status,
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
