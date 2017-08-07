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
    sessionId: PropTypes.number,
    sendContinueLink: PropTypes.func,
    isSendingContinueLink: PropTypes.bool,
    sendContinueLinkResponse: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {
      urlCopied: false,
      emailSent: false
    };
  };

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  handleSend = () => {
    const emailAddress = this.refs.email.value;
    const { sessionId, formId, sendContinueLink } = this.props;
    if (emailAddress) {
      this.setState({emailSent: true});
      var url = getSessionURL(formId, sessionId);
      sendContinueLink(sessionId, emailAddress, url);
    }
  }

  renderSendResponse() {
    const { sendContinueLinkResponse } = this.props;
    const { emailSent } = this.state;
    if (emailSent) {
      if (sendContinueLinkResponse === 'fail') {
        return (
          <p className={cx('sendError')}>
            There was a problem sending the resume link.
            Please use the Copy Link button above to copy the link to your clipboard.
          </p>
        );
      } else if (sendContinueLinkResponse !== null) {
        // console.log(sendContinueLinkResponse);
        // TODO: check for server-side errors in the return value
        return (<p className={cx('sendSuccess')}><FaCheck /> A resume link has been sent.</p>);
      }
    }
    return false;
  }

  render() {
    const { sessionId, formId, show, handleHide } = this.props;

    return (
      <Modal show={show} bsSize="large" onHide={handleHide} className={cx('saveModal')}>
        <Modal.Body>
          <h3>Send resume link</h3>
          <p className={cx('dialogDescription')}>Input an email address<br />to send a resume link to.</p>
          <input type="text" ref="email" className={cx('emailField')} />
          <div className={cx('urlField')}>
            <input type="text" ref="url" readOnly className={cx('urlFieldInner')}
              value={getSessionURL(formId, sessionId)} />
            <CopyToClipboard text={getSessionURL(formId, sessionId)} onCopy={this.handleCopy}>
              <span className={cx('copyButton')}>Copy URL</span>
            </CopyToClipboard>
          </div>
          {this.state.urlCopied
            ? <p className={cx('urlCopied')}><FaCheck /> URL copied to clipboard.</p> : null}
          <Button className={cx('sendButton')} block
            disabled={this.props.isSendingContinueLink}
            onClick={this.handleSend}>
            Send
          </Button>
          {this.renderSendResponse()}
          <p><a onClick={handleHide}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'saveForLaterModal' })(SaveForLaterModal);
