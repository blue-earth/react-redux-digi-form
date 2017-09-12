import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import styles from './DownloadModal.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class DownloadModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    handleHide: PropTypes.func.isRequired,
    responseId: PropTypes.number,
    fileType: PropTypes.oneOf(['PDF', 'CSV'])
  }

  handleCloseModal = () => {
    this.props.handleHide();
  }

  render() {
    const { responseId, fileType } = this.props;
    var downloadUrl = '';
    if (fileType === 'CSV') {
      downloadUrl = `${API_URL}/form_document/api/form_response/${responseId}/export_csv/`;
    }
    if (fileType === 'PDF') {
      // TODO: does this exist in the backend?
      downloadUrl = `${API_URL}/form_document/api/form_response/${responseId}/export_pdf/`;
    }
    return (
      <Modal backdrop="static" show={this.props.show}
        className={styles.sendFormLinkModal} dialogClassName={styles.modalWrapper}>
        <h3 className={cx('modalHeader')}>Download Form Submission {fileType}</h3>
        <Modal.Body bsClass={styles.sendFormLinkModalWrapper}>
          <p><a href={downloadUrl} className={cx('downloadButton')}>Download</a></p>
          <p><a onClick={this.handleCloseModal} className={cx('cancelButton')}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'downloadModal' })(DownloadModal);
