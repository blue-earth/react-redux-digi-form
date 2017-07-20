import connect from 'redux/utils/connect';
import {
  INIT_FORM_STATE
} from 'redux/modules/formInteractive';
import FileUpload from './FileUpload';

// FileUpload component needs to access id and sessionId

const mapStateToProps = (state) => {
  const { formInteractive } = state;
  const {
    id,
    sessionId
  } = formInteractive || INIT_FORM_STATE;
  return {
    formId: parseInt(id, 10),
    sessionId: parseInt(sessionId, 10)
  };
};

export default connect(mapStateToProps)(FileUpload);
