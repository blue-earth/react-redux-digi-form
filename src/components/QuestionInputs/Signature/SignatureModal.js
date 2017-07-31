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
import styles from './Signature.scss';
import classNames from 'classnames';
import moment from 'moment';
import DrawSignature from 'components/SignatureWidget/DrawSignature';
import WriteSignature from 'components/SignatureWidget/WriteSignature';

const WRITE = 'write';
const DRAW = 'draw';
const UPLOAD = 'upload';

class SignatureModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired, // Modal hide function
    show: PropTypes.bool,                 // Modal display status
    value: PropTypes.string,
    commitValue: PropTypes.func,
    isConsented: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTabName: WRITE,
      signatureName: '',
      isConsented: props.isConsented || false
    };
  };

  handleTabSelect = (activeTabName) => {
    this.setState({ activeTabName });
  }

  handleSubmit = () => {
    const { handleHide, commitValue } = this.props;
    const { activeTabName } = this.state;
    if (activeTabName === WRITE) {
      commitValue(this.refs.write.dataUrl);
    }
    if (activeTabName === DRAW) {
      commitValue(this.refs.draw.dataUrl);
    }
    if (activeTabName === UPLOAD) {
      var signatureFile = this.refs.signatureFile.file();
      if (!signatureFile || signatureFile.length === 0) {
        commitValue('');
      } else {
        let reader = new FileReader();
        reader.readAsDataURL(signatureFile);
        reader.onload = (e) => {
          commitValue(e.target.result);
        };
      }
    }
    handleHide();
  }

  handleNameChange = (value) => {
    this.setState({
      signatureName: value
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

  render() {
    const { handleHide, show } = this.props;
    const {
      signatureName,
      activeTabName,
      isConsented
    } = this.state;

    const writeLogo = require('./Write.svg');
    const drawLogo = require('./Draw.svg');
    const uploadLogo = require('./Upload.svg');

    moment.locale('en-au');
    return (
      <Modal show={show} onHide={handleHide} className={styles.signatureModal}
        aria-labelledby="ModalHeader">
        <Modal.Header>
          <Modal.Title bsClass={styles.signatureModalTitle}>
            YOUR SIGNATURE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body bsClass={styles.signatureModalWrapper}>
          <Row className={styles.infoSection}>
            <Col xs={6}>
              <div>Full name</div>
              <FloatTextInput
                extraClass={styles.signatureInput}
                autoFocus
                value={signatureName}
                placeholder="Enter full name"
                onChange={this.handleNameChange}
                onEnterKey={this.handleAccept}
              />
            </Col>
            <Col xs={3} xsPush={3}>
              <div>Date</div>
              <span className={styles.info}>{moment().format('L')}</span>
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
              <WriteSignature ref="write" signatureName={signatureName} className={styles.tabPanelWrapper} />
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
              <DrawSignature ref="draw" className={styles.tabPanelWrapper} />
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
                  <ImageUploader ref="signatureFile" />
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
          <Button bsStyle="primary" onClick={this.handleSubmit} disabled={!isConsented}>
            Accept & Witness
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'signatureModal' })(SignatureModal);
