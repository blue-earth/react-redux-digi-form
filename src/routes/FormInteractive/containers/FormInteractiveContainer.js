import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  INIT_FORM_STATE,
  prevQuestion,
  nextQuestion,
  goToQuestion,
  handleEnter,
  storeAnswer,
  submitAnswer,
  fetchAnswers,
  fetchFormIfNeeded,
  updateAccessCode,
  resetFormSubmitStatus
} from 'redux/modules/formInteractive';

import FormInteractive from '../components/FormInteractive';

const mapActionCreators = {
  prevQuestion,
  nextQuestion,
  fetchFormIfNeeded,
  storeAnswer,
  fetchAnswers,
  submitAnswer,
  goToQuestion,
  handleEnter,
  updateAccessCode,
  resetFormSubmitStatus,
  showModal: show
};

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    isVerifying,
    currentQuestionId,
    title,
    form,
    answers,
    prefills,
    verificationStatus,
    primaryColor,
    lastFormSubmitStatus,
    shouldShowFinalSubmit,
    isAccessCodeProtected,
    formAccessStatus,
    formAccessCode
  } = formInteractive || INIT_FORM_STATE;
  return {
    id: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10),
    isFetchingForm,
    isVerifying,
    currentQuestionId,
    title,
    form,
    answers,
    prefills,
    primaryColor,
    verificationStatus,
    lastFormSubmitStatus,
    shouldShowFinalSubmit,
    isAccessCodeProtected,
    formAccessStatus,
    formAccessCode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormInteractive);
