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
  updateAccessCode
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
  showModal: show,
  goTo
};

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    isVerifying,
    currentQuestion,
    title,
    form,
    answers,
    prefills,
    verificationStatus,
    primaryColour,
    shouldShowFinalSubmit,
    isAccessCodeProtected,
    formAccessStatus,
    formAccessCode
  } = formInteractive || INIT_FORM_STATE;
  return {
    formId: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10),
    isFetchingForm,
    isVerifying,
    currentQuestion,
    title,
    form,
    answers,
    prefills,
    primaryColour,
    verificationStatus,
    shouldShowFinalSubmit,
    isAccessCodeProtected,
    formAccessStatus,
    formAccessCode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormInteractive);
