import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import { getSessionURL } from 'helpers/formInteractiveHelper';
import { connectModal } from 'redux-modal';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCheck } from 'react-icons/lib/fa';
import classNames from 'classnames/bind';
import styles from './SaveForLaterModal.scss';

const cx = classNames.bind(styles);

class SaveForLaterModal extends Component {

  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    formId: PropTypes.number,
    sessionId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false
    };
  };

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  render() {
    const {
      sessionId,
      formId,
      show,
      handleHide
    } = this.props;

    return (
      <Modal show={show} bsSize="large" onHide={handleHide} className={cx('saveModal')}>
        <Modal.Body>
          <h3>Send resume link</h3>
          <p className={cx('dialogDescription')}>Input an email address<br />to send a resume link to.</p>
          <input type="text" className={cx('emailField')} />
          <div className={cx('urlField')}>
            <input type="text" readOnly className={cx('urlFieldInner')} value={getSessionURL(formId, sessionId)} />
            <CopyToClipboard text={getSessionURL(formId, sessionId)} onCopy={this.handleCopy}>
              <span className={cx('copyButton')}>Copy URL</span>
            </CopyToClipboard>
          </div>
          {this.state.urlCopied
            ? <p className={cx('urlCopied')}><FaCheck /> URL copied to clipboard.</p> : null}
          <Button className={cx('sendButton')} block>Send</Button>
          <p><a onClick={handleHide}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'saveForLaterModal' })(SaveForLaterModal);
