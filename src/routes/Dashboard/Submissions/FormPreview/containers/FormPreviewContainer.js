import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  INIT_FORM_STATE,
  fetchAnswers,
  fetchFormIfNeeded,
  updateAccessCode
} from 'redux/modules/submissionPreview';

import FormPreview from '../components/FormPreview/FormPreview';

const mapActionCreators = {
  fetchFormIfNeeded,
  fetchAnswers,
  updateAccessCode,
  show
};

const mapStateToProps = (state) => {
  const { submissionPreview } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    form,
    answers,
    primaryColour,
    formAccessStatus,
    formAccessCode
  } = submissionPreview || INIT_FORM_STATE;
  return {
    id: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10),
    isFetchingForm,
    form,
    answers,
    primaryColour,
    formAccessStatus,
    formAccessCode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormPreview);
