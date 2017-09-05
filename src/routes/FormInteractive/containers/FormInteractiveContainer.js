import connect from 'redux/utils/connect';
import { goTo } from 'redux/modules/router';
import { show } from 'redux-modal';
import {
  INIT_FORM_STATE,
  changeCurrentState,
  goToPrevQuestion,
  goToNextQuestion,
  goToQuestion,
  handleEnter,
  storeAnswer,
  submitAnswer,
  fetchAnswers,
  fetchFormIfNeeded,
  updateAccessCode,
  setInputLocked,
  setIDVerifyStatus,
  sendContinueLink
} from 'redux/modules/formInteractive';

import FormInteractive from '../components/FormInteractive';

const mapActionCreators = {
  changeCurrentState,
  goToPrevQuestion,
  goToNextQuestion,
  fetchFormIfNeeded,
  storeAnswer,
  fetchAnswers,
  submitAnswer,
  goToQuestion,
  handleEnter,
  updateAccessCode,
  setInputLocked,
  setIDVerifyStatus,
  sendContinueLink,
  showModal: show,
  goTo
};

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    currentQuestion,
    title,
    form,
    formConfig,
    answers,
    prefills,
    verificationStatus,
    primaryColour,
    shouldShowFinalSubmit,
    isInputLocked,
    isAccessCodeProtected,
    numberOfPages,
    formAccessStatus,
    formAccessCode,
    idVerifyStatus,
    isSendingContinueLink,
    sendContinueLinkResponse
  } = formInteractive || INIT_FORM_STATE;
  return {
    formId: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10),
    isFetchingForm,
    currentQuestion,
    title,
    form,
    formConfig,
    answers,
    prefills,
    primaryColour,
    verificationStatus,
    shouldShowFinalSubmit,
    isInputLocked,
    isAccessCodeProtected,
    numberOfPages,
    formAccessStatus,
    formAccessCode,
    idVerifyStatus,
    isSendingContinueLink,
    sendContinueLinkResponse
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormInteractive);
