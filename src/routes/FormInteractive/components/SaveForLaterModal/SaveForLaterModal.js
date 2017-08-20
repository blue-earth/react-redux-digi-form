import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal
} from 'react-bootstrap';
import AppButton from 'components/Buttons/AppButton';
import { getSessionURL } from 'helpers/formInteractiveHelper';
import { connectModal } from 'redux-modal';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCheck } from 'react-icons/lib/fa';
import classNames from 'classnames/bind';
import { validateIsEmail } from 'helpers/validationHelper';
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
      emailSent: false,
      isSendDisabled: true
    };
  };

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  handleEmailChange = (event) => {
    const email = event.target.value;
    if (validateIsEmail(email)) {
      this.setState({isSendDisabled: false});
    } else {
      this.setState({isSendDisabled: true});
    }
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
      if (sendContinueLinkResponse.form_continue_url) {
        // success
        return (<p className={cx('sendSuccess')}><FaCheck /> A resume link has been sent.</p>);
      } else if (sendContinueLinkResponse.email === 'Enter a valid email address.') {
        // bad email
        return (<p className={cx('sendError')}>Please enter a valid email address.</p>);
      } else {
        // fallback error message
        return (
          <p className={cx('sendError')}>
            There was a problem sending the resume link.
            Please use the Copy Link button above to copy the link to your clipboard.
          </p>
        );
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
          <input type="text" ref="email" className={cx('emailField')} onChange={this.handleEmailChange} />
          <div className={cx('urlField')}>
            <input type="text" ref="url" readOnly className={cx('urlFieldInner')}
              value={getSessionURL(formId, sessionId)} />
            <CopyToClipboard text={getSessionURL(formId, sessionId)} onCopy={this.handleCopy}>
              <span className={cx('copyButton')}>Copy URL</span>
            </CopyToClipboard>
          </div>
          {this.state.urlCopied
            ? <p className={cx('urlCopied')}><FaCheck /> URL copied to clipboard.</p> : null}
          <p><AppButton className={cx('sendButton')} block size="lg"
            isDisabled={this.state.isSendDisabled}
            isBusy={this.props.isSendingContinueLink}
            onClick={this.handleSend}>
            Send
          </AppButton></p>
          {this.renderSendResponse()}
          <p><a onClick={handleHide}>Go back</a></p>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'saveForLaterModal' })(SaveForLaterModal);
