import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button
} from 'react-bootstrap';
import getCsrfToken from 'redux/utils/csrf';
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
      urlCopied: false,
      emailSent: '',
      isSendingEmail: false
    };
  };

  handleCopy = () => {
    this.setState({urlCopied: true});
  }

  handleSend = () => {
    this.setState({isSendingEmail: true});
    const { sessionId } = this.props;
    var requestURL = `${API_URL}/form_document/api/form_response/send_resume_link/`;
    var method = 'POST';
    const formData = new FormData();
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    formData.append('response_id', sessionId);
    formData.append('email', this.refs.email.value);
    xhr.onload = this.handleSendResponse;
    xhr.open(method, requestURL, true);
    xhr.setRequestHeader('X-CSRFToken', getCsrfToken());
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
  }

  handleSendResponse = (event) => {
    // var response = JSON.parse(event.target.response);
    if (event.target.status >= 200 && event.target.status <= 206) {
      this.setState({emailSent: 'success', isSendingEmail: false});
    } else {
      this.setState({emailSent: 'fail', isSendingEmail: false});
    }
  }

  renderSendResponse() {
    const { emailSent } = this.state;
    if (emailSent === 'success') {
      return (<p className={cx('sendSuccess')}><FaCheck />A resume link has been sent.</p>);
    } else if (emailSent === 'fail') {
      return (
        <p className={cx('sendError')}>
          There was a problem sending the resume link.
          Please try again, or use the Copy Link button above to copy the link to your clipboard.
        </p>
      );
    }
    return false;
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
            disabled={this.state.isSendingEmail}
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
