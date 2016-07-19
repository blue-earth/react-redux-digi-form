import connect from 'redux/utils/connect';
import { show } from 'redux-modal';
import {
  INIT_FORM_STATE,
  fetchAnswers,
  fetchFormIfNeeded,
  updateAccessCode
} from 'redux/modules/formInteractive';

import FormPreview from '../components/FormPreview/FormPreview';

const mapActionCreators = {
  fetchFormIfNeeded,
  fetchAnswers,
  updateAccessCode,
  show
};

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId,
    isFetchingForm,
    form,
    answers,
    primaryColor,
    formAccessStatus,
    formAccessCode
  } = formInteractive || INIT_FORM_STATE;
  return {
    id: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10),
    isFetchingForm,
    form,
    answers,
    primaryColor,
    formAccessStatus,
    formAccessCode
  };
};

export default connect(mapStateToProps, mapActionCreators)(FormPreview);
