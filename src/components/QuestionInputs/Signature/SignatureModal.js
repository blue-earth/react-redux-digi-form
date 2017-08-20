import React, {
  Component,
  PropTypes
} from 'react';
import {
  Modal,
  Button,
  Tabs,
  Tab,
  Row,
  Col
} from 'react-bootstrap';
import FloatTextInput from 'components/QuestionInputs/FloatTextInput';
import ImageUploader from 'components/SignatureWidget/ImageUploader';
import { connectModal } from 'redux-modal';
import styles from './SignatureModal.scss';
import classNames from 'classnames';
import moment from 'moment';
import AppButton from 'components/Buttons/AppButton';
import DrawSignature from 'components/SignatureWidget/DrawSignature';
import WriteSignature from 'components/SignatureWidget/WriteSignature';
import CompletionModal from './CompletionModal';
import { validateIsEmail } from 'helpers/validationHelper';

const WRITE = 'write';

class SignatureModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired, // Current modal hide function
    show: PropTypes.bool,                 // Modal display status
    hide: PropTypes.func.isRequired,      // Hide modal function from 'redux-modal'
    value: PropTypes.object,
    isPageBusy: PropTypes.bool,
    isConsented: PropTypes.bool,
    isCodeVerifyingModalOpen: PropTypes.bool.isRequired,
    isCodeVerified: PropTypes.bool.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    updateSessionId: PropTypes.func.isRequired,
    requestVerificationCode: PropTypes.func.isRequired,
    closeVerificationModal: PropTypes.func.isRequired,
    resetCodeVerified: PropTypes.func.isRequired,
    submitValue: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const {name, email} = props.value;
    this.state = {
      name: name || '',
      email: email || '',
      isConsented: props.isConsented || false,
      isNameValidated: true,
      isSignatureValidated: true,
      isEmailValidated: true,
      activeTabName: WRITE
    };
  };

  componentDidMount() {
    this.props.updateSessionId();
  }

  handleSubmit = () => {
    const { submitValue } = this.props;
    const { activeTabName, name, email } = this.state;
    const dataUrl = this.refs[activeTabName].dataUrl;
    let isValid = true;
    // Empty signature error handle
    if (dataUrl === '') {
      this.refs.errorMessageFocus.focus();
      this.setState({
        isSignatureValidated: false
      });
      isValid = false;
    }
    // Empty signature name error handle
    if (name.length === 0) {
      this.refs.nameInput.refs.input.focus();
      this.setState({
        isNameValidated: false
      });
      isValid = false;
    }
    if (!validateIsEmail(email)) {
      this.refs.emailInput.refs.input.focus();
      this.setState({
        isEmailValidated: false
      });
      isValid = false;
    }
    if (isValid) {
      submitValue({dataUrl, email, name});
    }
  }

  handleTabSelect = (activeTabName) => {
    this.setState({
      activeTabName,
      isSignatureValidated: true,
      isEmailValidated: true
    });
  }

  handleNameChange = (value) => {
    this.setState({
      name: value,
      isNameValidated: true,
      isSignatureValidated: true
    });
  }
  handleEmailChange = (value) => {
    this.setState({
      email: value,
      isEmailValidated: true
    });
  }

  handleToggleConsent = (event) => {
    this.setState({
      isConsented: !this.state.isConsented
    });
  }

  handleDrawSignatureCanvasResize = () => {
    this.refs.draw.resizeSignaturePad();
  }

  handleSignatureChange = () => {
    this.setState({
      isSignatureValidated: true
    });
  }

  get signatureHeader() {
    const {
      name,
      email,
      isNameValidated,
      isEmailValidated,
      isSignatureValidated
    } = this.state;
    return (
      <div>
        <Row>
          <Col xs={6}>
            <div>Full name</div>
            <FloatTextInput
              ref="nameInput"
              errorMessage={<span>This field can not be empty</span>}
              hasError={!isNameValidated}
              extraClass={styles.signatureInput}
              size="md"
              autoFocus
              value={name}
              placeholder="Enter full name"
              onChange={this.handleNameChange} />
          </Col>
          <Col xs={6}>
            <div>Email</div>
            <FloatTextInput
              ref="emailInput"
              errorMessage={<span>Email address is not valid</span>}
              hasError={!isEmailValidated}
              extraClass={styles.signatureInput}
              size="md"
              value={email}
              placeholder="Enter email"
              onChange={this.handleEmailChange} />
          </Col>
        </Row>
        <Row className={styles.infoSection}>
          <Col xs={6}>
            Date
            {' '}
            <span className={styles.info}>{moment().format('L')}</span>
          </Col>
          <Col xs={12}>
            <input tabIndex={-1} ref="errorMessageFocus" style={{padding: '0', border: '0', width: '0'}} />
            {!isSignatureValidated && <span className={styles.errorMessage}>Please sign your signature</span>}
          </Col>
        </Row>
      </div>
    );
  }

  get signatureTabs() {
    const writeLogo = require('./Write.svg');
    const drawLogo = require('./Draw.svg');
    const uploadLogo = require('./Upload.svg');
    const {activeTabName, name} = this.state;
    return (
      <Tabs
        activeKey={activeTabName}
        id="SignatureTabs"
        onSelect={this.handleTabSelect}
        className={classNames({'activeTab': activeTabName === 'write'})}>
        <Tab eventKey="write" title={
          <div>
            <img className={styles.tabIcon} src={writeLogo} />
            <span>{' '}Write</span>
          </div>
        }>
          <WriteSignature
            ref="write"
            onChange={this.handleSignatureChange}
            signatureName={name}
            className={styles.tabPanelWrapper} />
        </Tab>
        <Tab
          onEntered={this.handleDrawSignatureCanvasResize}
          eventKey="draw" title={
            <span><img className={styles.tabIcon} src={drawLogo} />{' '}Draw</span>
        }>
          <DrawSignature
            ref="draw"
            onChange={this.handleSignatureChange}
            className={styles.tabPanelWrapper} />
        </Tab>
        <Tab eventKey="upload" title={
          <span>
            <img className={styles.tabIcon} src={uploadLogo} />
            {' '}
            Upload photo
          </span>
        }>
          <div className={styles.tabPanelWrapper}>
            <div className={styles.fileUploadSection}>
              <ImageUploader ref="upload" onChange={this.handleSignatureChange} />
            </div>
          </div>
        </Tab>
      </Tabs>
    );
  }

  get consentSection() {
    const { isConsented } = this.state;
    return (
      <div className={classNames(
        styles.signatureModalConsent,
        styles.signatureModalWrapper
      )}>
        <div className={styles.consentTitle}>
          <div style={{width: '30px', float: 'left'}}>
            <input id="consent" type="checkbox" className={styles.checkbox}
              value={isConsented} checked={isConsented} onChange={this.handleToggleConsent} />
          </div>
          <div><label htmlFor="consent">I consent to the following</label></div>
        </div>
        <div style={{marginLeft: '30px'}}>
          <p className={styles.consentStatement}>
            Lorem ipsum Occaecat proident.
            irure proident nisi ea eiusmod mollit ex cillum.
            dolor consequat et voluptate officia velit in cupidatat ad do sed aute voluptate.
            ullamco nostrud sit eu ad labore elit cillum in officia sunt aliquip reprehenderit.
            in labore qui in voluptate Duis do Duis deserunt anim Duis Excepteur commodo fugiat.
            esse do id nostrud aute tempor reprehenderit laborum in sint culpa velit elit velit.
          </p>
        </div>
      </div>
    );
  }

  get verifyCodeModal() {
    const {
      isCodeVerified,
      closeVerificationModal,
      verifyEmailCode,
      requestVerificationCode,
      resetCodeVerified
    } = this.props;
    return (
      <CompletionModal
        hasError={!isCodeVerified}
        closeModal={closeVerificationModal}
        verifyEmailCode={verifyEmailCode}
        resendCode={requestVerificationCode}
        resetCodeVerified={resetCodeVerified} />
    );
  }

  render() {
    const {
      handleHide,
      show,
      isPageBusy,
      isCodeVerifyingModalOpen
    } = this.props;
    const {
      isConsented,
      isEmailValidated,
      isSignatureValidated
    } = this.state;

    moment.locale('en-au');
    return (
      <form>
        <Modal
          backdrop="static"
          show={show}
          className={classNames(styles.signatureModal, {
            'hide': isCodeVerifyingModalOpen
          })}
          aria-labelledby="ModalHeader">
          <Modal.Header>
            <Modal.Title bsClass={styles.signatureModalTitle}>
              YOUR SIGNATURE
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={styles.signatureModalWrapper}>
            {this.signatureHeader}
            {this.signatureTabs}
          </Modal.Body>
          {this.consentSection}
          <Modal.Footer className={classNames(
            styles.signatureModalFooter,
            styles.signatureModalWrapper
          )}>
            <Button onClick={handleHide} bsStyle="link" className={styles.cancelButton}>
              Cancel
            </Button>
            <AppButton
              onClick={this.handleSubmit}
              isDisabled={!(isConsented && isEmailValidated && isSignatureValidated)}
              isBusy={isPageBusy}
              extraClass={styles.signButton}>
              Sign
            </AppButton>
          </Modal.Footer>
        </Modal>
        {this.verifyCodeModal}
      </form>
    );
  }
}

export default connectModal({ name: 'signatureModal' })(SignatureModal);
