import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import styles from './UploadModal.scss';
import XHRUploader from 'components/XHRUploader/XHRUploader';

class UploadModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    formId: PropTypes.number
  };

  render() {
    const { show, handleHide, formId } = this.props;
    var requestURL = `${API_URL}/form_document/api/form/`;
    var method = 'POST';
    if (formId) {
      requestURL += `${formId}/`;
      method = 'PUT';
    }
    return (
      <Modal show={show} onHide={handleHide}
        backdrop="static"
        dialogClassName={styles.uploadModal}>
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
            />
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button>
            Create your form
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'uploadModal' })(UploadModal);
