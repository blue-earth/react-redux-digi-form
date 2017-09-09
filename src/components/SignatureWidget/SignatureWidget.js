import React, {
  Component,
  PropTypes
} from 'react';
import {
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import FloatTextInput from 'components/QuestionInputs/FloatTextInput';
import ImageUploader from './ImageUploader';
import styles from './SignatureWidget.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import AppButton from 'components/Buttons/AppButton';
import DrawSignature from './DrawSignature';
import WriteSignature from './WriteSignature';

const WRITE = 'write';
const cx = classNames.bind(styles);

class SignatureWidget extends Component {
  static propTypes = {
    value: PropTypes.object,
    errors: PropTypes.object,
    resetErrors: PropTypes.func,
    formTitle: PropTypes.string,
    hasConsentCheckbox: PropTypes.bool,
    isInputLocked: PropTypes.bool,
    onChange: PropTypes.func,
    closeWidget: PropTypes.func,
    isEditAnswerModal: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const {name, email} = props.value;
    this.state = {
      name: name || '',
      email: email || '',
      isConsented: !this.props.hasConsentCheckbox,
      activeTabName: WRITE
    };
  };

  handleSubmit = () => {
    const { activeTabName, name, email } = this.state;
    const dataUrl = this.refs[activeTabName].dataUrl;
    this.props.onChange({dataUrl, email, name});
  }

  handleTabSelect = (activeTabName) => {
    this.setState({
      activeTabName
    });
    this.props.resetErrors;
  }

  handleNameChange = (value) => {
    this.setState({
      name: value
    });
    this.props.resetErrors('name');
  }

  handleEmailChange = (value) => {
    this.setState({
      email: value
    });
    this.props.resetErrors('email');
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
    this.props.resetErrors('dataUrl');
  }

  get signatureHeader() {
    return (
      <div>
        <Row>
          <div className={cx(styles.inputWrapper, styles.inputLeft)}>
            <FloatTextInput
              ref="nameInput"
              errors={this.props.errors.name}
              extraClass={styles.signatureInput}
              size="md"
              autoFocus
              value={this.state.name}
              label="Full name"
              onChange={this.handleNameChange}
              errorPlacement="top" />
          </div>
          <div className={cx(styles.inputWrapper, styles.inputRight)}>
            <FloatTextInput
              ref="emailInput"
              type="EmailField"
              errors={this.props.errors.email}
              extraClass={styles.signatureInput}
              size="md"
              value={this.state.email}
              label="Email"
              onChange={this.handleEmailChange} />
          </div>
        </Row>
        <Row>
          <Col xs={6}>
            Date
            {' '}
            <span className={styles.info}>{moment().format('L')}</span>
          </Col>
        </Row>
        {this.props.errors.dataUrl.length > 0 &&
          <div className={cx(styles.errorMessageWrapper)}>
            <input tabIndex={-1} ref="errorMessageFocus" style={{padding: '0', border: '0', width: '0'}} />
            <span className={styles.errorMessage}>Please sign your signature</span>
          </div>
        }
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
        className={cx({'activeTab': activeTabName === 'write'})}>
        <Tab eventKey="write" title={
          <div>
            <img className={styles.tabIcon} src={writeLogo} />
            <span>{' '}Type</span>
          </div>
        }>
          <WriteSignature
            ref="write"
            onTabChange={this.handleTabSelect}
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
            onTabChange={this.handleTabSelect}
            onChange={this.handleSignatureChange}
            className={styles.tabPanelWrapper} />
        </Tab>
        <Tab eventKey="upload" title={
          <span>
            <img className={styles.tabIcon} src={uploadLogo} />
            {' '}
            Upload
          </span>
        }>
          <div className={styles.tabPanelWrapper}>
            <div className={styles.fileUploadSection}>
              <ImageUploader
                ref="upload"
                onChange={this.handleSignatureChange} />
            </div>
          </div>
        </Tab>
      </Tabs>
    );
  }

  get consentSection() {
    const { isConsented, name } = this.state;
    const { formTitle } = this.props;
    const termsNConditions = (
      <Popover id="terms-and-conditions" title="Terms & Conditions">
        <p>By continuing,
        I agree that the text or image displayed or created above is my or my authorised agent’s electronic
        signature (electronic representation of my or my authorised agent’s signature).
        The electronic signature shall have the same force and effect as a signature
        affixed by hand on a paper document. I or my agent on my behalf may affix
        electronic signature for the purposes of authorizing and authenticating
        electronic forms.</p>
        <p>I acknowledge that on the {moment().format('L')}, at {moment().format('LT')} the
          form {formTitle} was electronically signed by the signer {name} using his/her electronic signature.
        </p>
      </Popover>
    );
    return (
      <div className={styles.signatureWidgetConsent}>
        <div className={styles.consent}>
          <div style={{width: '30px', float: 'left'}}>
            <input id="consent" type="checkbox" className={styles.checkbox}
              value={isConsented} checked={isConsented} onChange={this.handleToggleConsent} />
          </div>
          <div className={styles.consentStatement}>
            <label htmlFor="consent" className={styles.consentLabel}>
              I consent to the following
            </label>
            <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={termsNConditions}>
              <div className={styles.btnLink}>terms & conditions</div>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      isInputLocked,
      errors,
      isEditAnswerModal
    } = this.props;
    const {
      isConsented
    } = this.state;
    const isSignDisabled = isInputLocked || !isConsented ||
      errors.email.length > 0 ||
      errors.name.length > 0 ||
      errors.dataUrl.length > 0;
    moment.locale('en-au');
    return (
      <form className={cx(styles.signatureWidgetWrapper, {'isEditAnswerModal': isEditAnswerModal})}>
        <div className={styles.signatureWidgetBody}>
          {this.signatureHeader}
          {this.signatureTabs}
        </div>
        {this.props.hasConsentCheckbox && this.consentSection}
        <div className={styles.signatureWidgetFooter}>
          {typeof this.props.closeWidget === 'function' &&
            <Button onClick={this.props.closeWidget} bsStyle="link" className={styles.cancelButton}>
              Cancel
            </Button>
          }
          <AppButton
            onClick={this.handleSubmit}
            isDisabled={isSignDisabled}
            isBusy={isInputLocked}
            extraClass={styles.signButton}>
            Sign
          </AppButton>
        </div>
      </form>
    );
  }
}

export default SignatureWidget;
