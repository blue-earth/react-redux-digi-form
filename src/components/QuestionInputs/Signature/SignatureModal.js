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
import SignaturePad from 'react-signature-pad';
import SignatureWidgetImageUploader from 'components/SignatureWidgetImageUploader';
import { connectModal } from 'redux-modal';
import { IoReply } from 'react-icons/lib/io';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import styles from './Signature.scss';
import classNames from 'classnames';
import moment from 'moment';

const signatureFonts = [
  {
    name: 'Swift',
    size: 220
  }, {
    name: 'Lincoln',
    size: 240
  }, {
    name: 'Steve',
    size: 160
  }, {
    name: 'MayQueen',
    size: 200
  }, {
    name: 'ArtySignature',
    size: 200
  }, {
    name: 'MonsieurLaDoulaise',
    size: 140
  }
];

const WRITE = 'write';
const DRAW = 'draw';
const UPLOAD = 'upload';

const colours = {
  black: '#000000',
  blue: '#3993d1',
  red: '#d45644'
};

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
      signatureStyle: signatureFonts[0].name,
      writeSignatureColour: 'black',
      drawSignatureColour: colours['black'],
      isConsented: props.isConsented
    };
    this.drawSignatures = [];
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWriteCanvasesResize);
    this.handleWriteCanvasesResize(); // Initializer for write canvases.
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWriteCanvasesResize);
  }

  handleTabSelect = (activeTabName) => {
    this.setState({ activeTabName });
  }

  handleSubmit = () => {
    const { handleHide, commitValue } = this.props;
    const { activeTabName, signatureStyle } = this.state;
    if (activeTabName === WRITE) {
      var canvas = this.refs[`writeSignature-${signatureStyle}`];
      commitValue(canvas.toDataURL());
    }
    if (activeTabName === DRAW) {
      var signature = this.refs.signatureCanvas;
      if (signature.isEmpty()) {
        commitValue('');
      } else {
        commitValue(signature.toDataURL());
      }
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

  handleWriteCanvasesResize = () => {
    const { activeTabName } = this.state;
    if (activeTabName === 'write') {
      signatureFonts.map((font) => {
        var writeCanvas = this.refs[`writeSignature-${font.name}`];
        writeCanvas.width = writeCanvas.parentElement.offsetWidth * 2;
      });
      this.updateWriteSignatureCanvases(); // Bug solution for not found canvas
    }
  }

  handleNameChange = (value) => {
    this.setState({
      signatureName: value
    }, this.updateWriteSignatureCanvases);
  }

  handleSignatureStyleChange = (event) => {
    const value = event.currentTarget.dataset.signature;
    this.setState({
      signatureStyle: value
    }, this.updateWriteSignatureCanvases);
  }
  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.handleAccept();
    }
  }
  handleSelectActiveColour = (colour) => {
    this.setState({
      writeSignatureColour: colour
    }, this.updateWriteSignatureCanvases);
  }
  handleColourChange = (colour) => {
    this.setState({
      drawSignatureColour: colour
    });
    this.refs.signatureCanvas.penColor = colour;
  }
  handleRevert = () => {
    this.refs.signatureCanvas.clear();
    this.refs.signatureCanvas.fromDataURL(this.drawSignatures.pop());
  }
  onStrokeStart = (event) => {
    this.drawSignatures.push(this.refs.signatureCanvas.toDataURL());
  }

  handleToggleConsent = (event) => {
    this.setState({
      isConsented: !this.state.isConsented
    });
  }

  /**
  * Redraw write signature panel canvas according to updated params (textWidth, color, canvasSize etc.).
  */
  updateWriteSignatureCanvases = () => {
    const { signatureName, writeSignatureColour } = this.state;
    signatureFonts.map((font) => {
      const signatureStyle = font.name;
      const canvas = this.refs[`writeSignature-${font.name}`];
      let ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      let adjustedHeight = font.size;
      ctx.font = `${adjustedHeight}px ${signatureStyle}`;
      let textWidth = ctx.measureText(signatureName).width;
      if (textWidth > width - 40) {
        adjustedHeight = parseInt(adjustedHeight * (width - 40) / textWidth);
      }
      ctx.font = `${adjustedHeight}px ${signatureStyle}`;
      textWidth = ctx.measureText(signatureName).width;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colours[writeSignatureColour];
      ctx.fillText(signatureName, (width-textWidth) / 2, canvas.height * 0.5);
    });
  }

  /**
  * Resize drawing signature canvas size when draw tab loading.
  */
  resizeSignaturePad = () => {
    var signatureCanvas = this.refs.signatureCanvas.refs.cv;
    if (signatureCanvas.width !== signatureCanvas.clientWidth) {
      signatureCanvas.width = signatureCanvas.clientWidth;
      signatureCanvas.height = signatureCanvas.clientHeight;
    }
  }

  render() {
    const { handleHide, show } = this.props;
    const {
      signatureName,
      signatureStyle,
      activeTabName,
      writeSignatureColour,
      drawSignatureColour,
      isConsented
    } = this.state;
    var preloadFonts = signatureFonts.map((font, index) => {
      return <div className={`signature-font-preload preload-${font.name}`} key={index}>font</div>;
    });
    const writeLogo = require('./Write.svg');
    const drawLogo = require('./Draw.svg');
    const uploadLogo = require('./Upload.svg');
    const writeSignatureColourSelection = (
      <ul className={styles.signaturePadColourSelection}>
        {Object.keys(colours).map((colourName, index) => {
          const colour = colours[colourName];
          let boundSelectActiveColour = this.handleSelectActiveColour.bind(this, colourName); // eslint-disable-line
          return (
            <li
              key={`colour-${index}`}
              onClick={boundSelectActiveColour}
              className={classNames(styles.colourSelection, {
                [styles.activeColour]: writeSignatureColour === colourName
              })}
              style={{backgroundColor: colour}}>
            </li>
          );
        })}
      </ul>
    );
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
              <div className={classNames(styles.tabPanelWrapper, styles.writePanelWrapper)}>
                <div className={styles.tabPanelTitle}>Like a celebrity</div>
                {preloadFonts}
                { signatureFonts.map((font, index) => (
                  <Col key={`signature-panel-${index}`} xs={6} className={classNames(
                    styles.signaturePanelWrapper,
                    {
                      [styles.signaturePanelLeft]: index % 2 === 0,
                      [styles.signaturePanelRight]: index % 2 === 1
                    }
                  )}>
                    <div className={classNames(
                      styles.signaturePanel,
                      {
                        [styles.activeSignature]: font.name === signatureStyle
                      }
                    )}
                      onClick={this.handleSignatureStyleChange}
                      data-signature={font.name}>
                      <div>
                        <canvas className={styles.signaturePanelCanvas}
                          ref={`writeSignature-${font.name}`} height="252">
                        </canvas>
                      </div>
                      {writeSignatureColourSelection}
                    </div>
                    <div className={styles.signatureTypeLabel}>
                      {font.name}
                    </div>
                  </Col>
                  ))
                }
                <div className="clearfix"></div>
              </div>
            </Tab>
            <Tab
              onEntered={this.resizeSignaturePad}
              eventKey="draw" title={
                <span>
                  <img className={styles.tabIcon} src={drawLogo} />
                  {' '}
                  Draw
                </span>
            }>
              <div className={classNames(styles.tabPanelWrapper, styles.drawPanelWrapper)}
                onKeyDown={this.handleKeyDown} tabIndex={0}>
                <div className={styles.drawPanelButtons}>
                  <div className="pull-right">
                    <ColorPicker
                      /**
                        * Use github style for color picker.
                        * See list of styles at https://casesandberg.github.io/react-color/
                        */
                      type="github"
                      value={drawSignatureColour}
                      customSwatches={Object.keys(colours).map((key) => colours[key])}
                      buttonClassName={styles.colorPickerButton}
                      onChange={this.handleColourChange}
                    />
                  </div>
                  <button className={styles.revertButton} onClick={this.handleRevert}>
                    <IoReply />
                  </button>
                  <div className="clearfix"></div>
                </div>
                <SignaturePad ref="signatureCanvas" penColor={drawSignatureColour}
                  onBegin={this.onStrokeStart} />
              </div>
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
                  <SignatureWidgetImageUploader ref="signatureFile" />
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
              <input type="checkbox" className={styles.checkbox}
                checked={isConsented} onChange={this.handleToggleConsent} />
            </div>
            <div>I consent to the following</div>
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
