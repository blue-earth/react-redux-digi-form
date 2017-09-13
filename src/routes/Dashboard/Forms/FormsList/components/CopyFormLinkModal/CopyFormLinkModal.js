import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import { FaCheck } from 'react-icons/lib/fa';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connectModal } from 'redux-modal';
import styles from './CopyFormLinkModal.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class CopyFormLinkModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    handleHide: PropTypes.func.isRequired,
    formId: PropTypes.number.isRequired,
    subdomain: PropTypes.string.isRequired,
    slug: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false
    };
  }

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  handleCloseModal = () => {
    this.props.handleHide();
  }

  render() {
    var formUrl = `https://${this.props.subdomain}/forms/`;
    if (this.props.slug) {
      formUrl += this.props.slug;
    } else {
      formUrl += this.props.formId;
    }
    return (
      <Modal backdrop="static" show={this.props.show}
        className={styles.sendFormLinkModal} dialogClassName={styles.modalWrapper}>
        <h3 className={cx('modalHeader')}>Copy Form Link</h3>
        <Modal.Body bsClass={styles.sendFormLinkModalWrapper}>
          <div className={cx('urlField')}>
            <input type="text" ref="url" readOnly className={cx('urlFieldInner')}
              value={formUrl} />
            <CopyToClipboard text={formUrl} onCopy={this.handleCopy}>
              <span className={cx('copyButton')}>Copy URL</span>
            </CopyToClipboard>
          </div>
          {this.state.urlCopied
            ? <p className={cx('urlCopied')}><FaCheck /> URL copied to clipboard.</p> : null}
          <p><a onClick={this.handleCloseModal} className={styles.cancelButton}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'copyFormLinkModal' })(CopyFormLinkModal);
