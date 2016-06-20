import React, { Component, PropTypes } from 'react'
import { Modal, Button, Tabs, Tab, FormGroup, ControlLabel } from 'react-bootstrap';
import ShortTextInput from 'components/QuestionInputs/ShortTextInput/ShortTextInput';
import SignaturePad from 'react-signature-pad';
import { connectModal } from 'redux-modal';
import styles from './Signature.scss';

class SignatureModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    value: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      /*
       * typeValue: type value.
       */
      typeValue: '',
      activeTabKey: 'type'
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
    });
    var canvas = this.refs.typeSignaturePad;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "100px MayQueen";
    ctx.textBaseline = 'middle';
    ctx.fillText(value, 20, canvas.height / 2);
  }

  handleTabSelect = (activeTabKey) => {
    this.setState({ activeTabKey });
  }

  render() {
    const { handleHide, show } = this.props;
    const { typeValue, activeTabKey } = this.state;
    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby="ModalHeader">
        <Modal.Header closeButton>
          <Modal.Title>Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTabKey} id="SignatureTabs"
            onSelect={this.handleTabSelect}>
            <Tab eventKey="type" title="Type">
              <div className={styles.typeWrapper}>
                <FormGroup controlId="formTypeFullname">
                  <ControlLabel>Full Name</ControlLabel>
                  <ShortTextInput
                    type="text"
                    autoFocus
                    value={typeValue}
                    placeholder="Enter full name"
                    onChange={this.handleTypeChange}
                  />
                </FormGroup>
                <div className={styles.typeSignatureWrapper}>
                  <canvas ref="typeSignaturePad" height="150" width="566">
                  </canvas>
                </div>
              </div>
            </Tab>
            <Tab eventKey="draw" title="Draw">
              <div className={styles.signaturePadWrapper}>
                <SignaturePad clearButton="true" ref="signature" />
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
