import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { INIT_FORM_STATE, prevQuestion, nextQuestion, goToQuestion, handleEnter,
  storeAnswer, fetchFormIfNeeded } from 'redux/modules/formInteractive';

import FormInteractive from '../components/FormInteractive/FormInteractive';

const mapActionCreators = {
  prevQuestion,
  nextQuestion,
  fetchFormIfNeeded,
  storeAnswer,
  goToQuestion,
  handleEnter
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
}

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    isFetching,
    isVerifying,
    currentQuestionId,
    form,
    answers,
    prefills,
    verificationStatus,
    primaryColor
  } = formInteractive || INIT_FORM_STATE;
  return {
    id : parseInt(id),
    isFetching,
    isVerifying,
    currentQuestionId,
    form,
    answers,
    prefills,
    primaryColor,
    verificationStatus
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormInteractive);
