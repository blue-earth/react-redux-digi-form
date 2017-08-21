import React, {
  Component,
  PropTypes
} from 'react';
import SignaturePad from 'react-signature-pad';
import ColourPicker from '../ColourPicker';
import classNames from 'classnames';
import styles from './DrawSignature.scss';
import { IoReply } from 'react-icons/lib/io';

class DrawSignature extends Component {

  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func
  };
  static defaultProps = {
    className: '',
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      drawSignatureColour: '#000000'
    };
    this.drawSignatures = [];
  }

  componentDidMount() {
    this.resizeSignaturePad();
  }

  get dataUrl() {
    const canvas = this.refs.signatureCanvas;
    if (canvas.isEmpty()) {
      return '';
    }
    return canvas.toDataURL();
  }

  handleColourChange = (colour) => {
    this.setState({
      drawSignatureColour: colour
    });
    this.refs.signatureCanvas.penColor = colour;
  }

  handleRevert = () => {
    this.refs.signatureCanvas.clear();
    const dataUrl = this.drawSignatures.pop();
    this.refs.signatureCanvas.fromDataURL(dataUrl);
    if (this.drawSignatures.length === 0) {
      this.refs.signatureCanvas.clear(); // Reset canvas to empty if nothing to set.
    }
  }

  onStrokeStart = (event) => {
    this.drawSignatures.push(this.refs.signatureCanvas.toDataURL());
    this.props.onChange();
  }

  /**
  * Resize drawing signature canvas size when draw tab loading.
  */
  resizeSignaturePad = (event) => {
    var signatureCanvas = this.refs.signatureCanvas.refs.cv;
    if (signatureCanvas.width !== signatureCanvas.clientWidth) {
      signatureCanvas.width = signatureCanvas.clientWidth;
      signatureCanvas.height = signatureCanvas.clientHeight;
    }
  }

  render() {
    const { className } = this.props;
    const { drawSignatureColour } = this.state;
    return (
      <div className={classNames(className, styles.drawPanelWrapper)}
        tabIndex={0}>
        <div className={styles.drawPanelButtons}>
          <div className={styles.colourPicker}>
            <ColourPicker onChange={this.handleColourChange} />
          </div>
          <button className={styles.revertButton} onClick={this.handleRevert}>
            <IoReply />
          </button>
          <div className="clearfix"></div>
        </div>
        <div className={styles.signatureWrapper}>
          <SignaturePad ref="signatureCanvas" penColor={drawSignatureColour}
            onBegin={this.onStrokeStart} />
          <div className={styles.guideLine}></div>
        </div>
      </div>
    );
  }
}

export default DrawSignature;
