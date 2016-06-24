import React, { Component, PropTypes } from 'react'
import { Modal, Button, Tabs, Tab, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import DropdownInput from 'components/QuestionInputs/DropdownInput/DropdownInput';
import SignaturePad from 'react-signature-pad';
import { connectModal } from 'redux-modal';
import styles from './Signature.scss';

const signatureFonts = [
  'MayQueen',
  'ArtySignature',
  'MonsieurLaDoulaise'
];

class SignatureModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    value: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 'draw',
      /*
       * typeValue: type value.
       */
      typeValue: '',
      typeFont: signatureFonts[0],
    };
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleTypeCanvasResize);
  }

  handleAccept = () => {
    const { handleHide, onSave } = this.props;
    const { activeTabKey } = this.state;
    if (activeTabKey === 'type') {
      var canvas = this.refs.typeSignaturePad;
      onSave(canvas.toDataURL());
    } else {
      var signature = this.refs.signature;
      if (signature.isEmpty()) {
        onSave('');
      } else {
        onSave(signature.toDataURL());
      }
    }
    handleHide();
  }

  handleTypeCanvasResize = () => {
    const { activeTabKey } = this.state;
    console.log(activeTabKey)
    if (activeTabKey === 'type') {
      var canvas = this.refs.typeSignaturePad;
      canvas.width = canvas.parentElement.offsetWidth;
    }
  }

  handleTypeChange = (value) => {
    this.setState({
      typeValue: value
    }, this.updateCanvas);
  }

  handleFontChange = (value) => {
    this.setState({
      typeFont: value
    }, this.updateCanvas);
  }

  updateCanvas = () => {
    const { typeValue, typeFont } = this.state;
    var canvas = this.refs.typeSignaturePad;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "100px " + typeFont;
    ctx.textBaseline = 'middle';
    ctx.fillText(typeValue, 20, canvas.height / 2);
  }

  handleTabSelect = (activeTabKey) => {
    this.setState({ activeTabKey });
  }

  render() {
    const { handleHide, show } = this.props;
    const { typeValue, typeFont, activeTabKey } = this.state;
    var preloadFonts = signatureFonts.map((fontName, index) => {
      return <div className={`signature-font-preload preload-${fontName}`} key={index}>font</div>
    })
    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby="ModalHeader">
        <Modal.Header closeButton>
          <Modal.Title>Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTabKey} id="SignatureTabs"
            onSelect={this.handleTabSelect}>
            <Tab eventKey="draw" title="Draw">
              <div className={styles.signaturePadWrapper}>
                <SignaturePad clearButton="true" ref="signature" />
              </div>
            </Tab>
            <Tab eventKey="type" title="Type">
              <div className={styles.typeWrapper}>
                {preloadFonts}
                <Row>
                  <Col xs={8}>
                    <FormGroup controlId="formTypeFullname">
                      <ControlLabel>Signature</ControlLabel>
                      <ShortTextInput
                        type="text"
                        autoFocus
                        value={typeValue}
                        placeholder="Enter full name"
                        onChange={this.handleTypeChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={4}>
                    <FormGroup controlId="formFontName">
                      <ControlLabel>Style</ControlLabel>
                      <DropdownInput
                        value={typeFont}
                        choices={signatureFonts}
                        onChange={this.handleFontChange}
                        includeBlank={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup controlId="formTypeFullname">
                  <ControlLabel>Preview</ControlLabel>
                  <div className={styles.typeSignatureWrapper}>
                    <canvas ref="typeSignaturePad" height="150" width="566">
                    </canvas>
                  </div>
                </FormGroup>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleAccept}>
            Accept & Witness
          </Button>
          <Button onClick={handleHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({ name: 'signatureModal' })(SignatureModal)
