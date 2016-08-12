import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { formsUrl } from 'helpers/urlHelper';
import { connectModal } from 'redux-modal';
import DashboardButton from 'components/Buttons/DashboardButton';
import styles from './UploadModal.scss';
import XHRUploader from 'components/XHRUploader/XHRUploader';

class UploadModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func,
    formId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      formId: props.formId,
      buttonDisabled: true
    };
  }

  handleUploadStart = () => {
    this.setState({ buttonDisabled: true });
  }

  handleUploadCancel = () => {
    this.setState({ buttonDisabled: true });
  }

  handleUploadSuccess = (response) => {
    this.setState({
      formId: response.id ? response.id : this.state.formId,
      buttonDisabled: false
    });
  }

  handleCreate = () => {
    const { formId } = this.state;
    const { goTo, handleHide } = this.props;
    handleHide();
    goTo(formsUrl(`/${formId}/edit`));
  }

  render() {
    const { show, handleHide } = this.props;
    const { formId, buttonDisabled } = this.state;
    var requestURL = `${API_URL}/form_document/api/form/`;
    var method = 'POST';
    if (formId) {
      requestURL += `${formId}/`;
      method = 'PUT';
    }
    return (
      <Modal show={show} onHide={handleHide}
        backdrop="static"
        className={styles.uploadModal}
        dialogClassName={styles.uploadModalDialog}
      >
        <Modal.Body className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            Upload file
          </h3>
          <div className={styles.uploaderWrapper}>
            <XHRUploader
              url={requestURL}
              fieldName="uploaded_document"
              method={method}
              maxFiles={1}
              accept="application/pdf"
              onStart={this.handleUploadStart}
              onCancel={this.handleUploadCancel}
              onSuccess={this.handleUploadSuccess}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <DashboardButton isDisabled={buttonDisabled}
            onClick={this.handleCreate}>
            Create your form
          </DashboardButton>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'uploadModal' })(UploadModal);
