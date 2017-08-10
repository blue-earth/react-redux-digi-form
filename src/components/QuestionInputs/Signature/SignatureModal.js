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
    handleHide: PropTypes.func.isRequired, // Modal hide function
    show: PropTypes.bool,                 // Modal display status
    showModal: PropTypes.func.isRequired,
    value: PropTypes.string,
    commitValue: PropTypes.func,
    isConsented: PropTypes.bool,
    isPageBusy: PropTypes.bool,
    email: PropTypes.string.isRequired,
    emailList: PropTypes.array.isRequired,
    changeEmail: PropTypes.func.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    fetchEmailList: PropTypes.func.isRequired,
    requestVerificationCode: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isSignatureValidated: true,
      isEmailValidated: true,
      commitValue: '',
      activeTabName: WRITE,
      signatureName: '',
      isConsented: props.isConsented || false,
      isVerificationModalOpen: false
    };
  };

  componentWillMount() {
    this.props.fetchEmailList();
  }

  hideVerificationModal = () => {
    this.props.hide('signatureVerificationModal');
    this.setState({ isVerificationModalOpen: false });
  }

  handleSubmit = () => {
    const { email, emailList, requestVerificationCode, showModal, handleHide, commitValue } = this.props;
    const { activeTabName } = this.state;
    const value = this.refs[activeTabName].dataUrl;
    // Empty signature error handle
    if (value === '') {
      return this.setState({
        isSignatureValidated: false
      });
    }
    if (!validateIsEmail(email)) {
      return this.setState({
        isEmailValidated: false
      });
    }
    if (emailList.indexOf(email) === -1) {
      requestVerificationCode();
      showModal('signatureVerificationModal');
      this.setState({ isVerificationModalOpen: true });
    } else {
      commitValue(this.refs[activeTabName].dataUrl);
      handleHide();
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
      signatureName: value,
      isSignatureValidated: true
    });
  }
  handleEmailChange = (value) => {
    this.props.changeEmail(value);
    this.setState({
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

  render() {
    const {
      handleHide,
      show,
      email,
      isPageBusy,
      verifyEmailCode,
      requestVerificationCode
    } = this.props;
    const {
      isEmailValidated,
      isSignatureValidated,
      signatureName,
      activeTabName,
      isConsented,
      isVerificationModalOpen
    } = this.state;

    const writeLogo = require('./Write.svg');
    const drawLogo = require('./Draw.svg');
    const uploadLogo = require('./Upload.svg');

    moment.locale('en-au');
    return (
      <div>
        <Modal
          backdrop="static"
          show={show}
          className={classNames(styles.signatureModal, {
            'hide': isVerificationModalOpen
          })}
          aria-labelledby="ModalHeader">
          <Modal.Header>
            <Modal.Title bsClass={styles.signatureModalTitle}>
              YOUR SIGNATURE
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={styles.signatureModalWrapper}>
            <Row>
              <Col xs={6}>
                <div>Full name</div>
                <FloatTextInput
                  extraClass={styles.signatureInput}
                  autoFocus
                  value={signatureName}
                  placeholder="Enter full name"
                  onChange={this.handleNameChange}
                />
              </Col>
              <Col xs={6}>
                <div>Email</div>
                <FloatTextInput
                  errorMessage={<span>Email address is not valid</span>}
                  hasError={!isEmailValidated}
                  extraClass={styles.signatureInput}
                  value={email}
                  placeholder="Enter email"
                  onChange={this.handleEmailChange}
                />
              </Col>
            </Row>
            <Row className={styles.infoSection}>
              <Col xs={6}>
                Date
                {' '}
                <span className={styles.info}>{moment().format('L')}</span>
              </Col>
              <Col xs={12}>
                {!isSignatureValidated && <span className={styles.errorMessage}>Please sign your signature</span>}
              </Col>
            </Row>
            <Tabs activeKey={activeTabName} id="SignatureTabs"
              onSelect={this.handleTabSelect}
              className={classNames(
                {'activeTab': activeTabName === 'write'})
              }>
              <Tab eventKey="write" title={
                <div>
                  <img className={styles.tabIcon} src={writeLogo} />
                  <span>
                    {' '}
                    Write
                  </span>
                </div>
              }>
                <WriteSignature
                  ref="write"
                  onChange={this.handleSignatureChange}
                  signatureName={signatureName}
                  className={styles.tabPanelWrapper} />
              </Tab>
              <Tab
                onEntered={this.handleDrawSignatureCanvasResize}
                eventKey="draw" title={
                  <span>
                    <img className={styles.tabIcon} src={drawLogo} />
                    {' '}
                    Draw
                  </span>
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
          </Modal.Body>
          <div className={classNames(
            styles.signatureModalConsent,
            styles.signatureModalWrapper
          )}>
            <div className={styles.consentTitle}>
              <div style={{width: '30px', float: 'left'}}>
                <input id="consent" type="checkbox" className={styles.checkbox}
                  checked={isConsented} onChange={this.handleToggleConsent} />
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
        <CompletionModal
          closeModal={this.hideVerificationModal}
          email={email}
          verifyEmailCode={verifyEmailCode}
          resendCode={requestVerificationCode} />
      </div>
    );
  }
}

export default connectModal({ name: 'signatureModal' })(SignatureModal);
