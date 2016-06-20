import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { show } from 'redux-modal'
import { INIT_FORM_STATE, prevQuestion, nextQuestion, goToQuestion, handleEnter,
  storeAnswer, submitAnswer, fetchAnswers, fetchFormIfNeeded, updateAccessCode } 
  from 'redux/modules/formInteractive';

import FormInteractive from '../components/FormInteractive/FormInteractive';

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
  show
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
}

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    isVerifying,
    currentQuestionId,
    form,
    answers,
    prefills,
    verificationStatus,
    primaryColor,
    lastFormSubmitStatus,
    shouldShowFinalSubmit,
    formAccess,
    formAccessCode
  } = formInteractive || INIT_FORM_STATE;
  return {
    id: parseInt(id),
    sessionId,
    isFetchingForm,
    isVerifying,
    currentQuestionId,
    form,
    answers,
    prefills,
    primaryColor,
    verificationStatus,
    lastFormSubmitStatus,
    shouldShowFinalSubmit,
    formAccess,
    formAccessCode
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormInteractive);
