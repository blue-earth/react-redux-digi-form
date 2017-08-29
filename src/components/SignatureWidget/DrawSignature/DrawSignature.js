import React, {
  Component,
  PropTypes
} from 'react';
import SignaturePad from 'react-signature-pad';
import ColourPicker from '../ColourPicker';
import classNames from 'classnames';
import styles from './DrawSignature.scss';
import { IoIosRefreshEmpty } from 'react-icons/lib/io';
import SignatureTabs from '../SignatureTabs';

/*
 * Convert Hex to RGB refer to: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 **/
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

class DrawSignature extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    onTabChange: PropTypes.func,
    className: PropTypes.string
  };
  static defaultProps = {
    onTabChange: () => {},
    className: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      drawSignatureColour: '#000000'
    };
    this.drawSignaturePaths = [];
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
    const oldColour = this.state.drawSignatureColour;
    if (oldColour !== colour) {
      this.setState({
        drawSignatureColour: colour
      });
      this.refs.signatureCanvas.penColor = colour;
      /*
       * Replace canvas pixel colour with new colour refer to: http://jsfiddle.net/m1erickson/4apAS/
       * Change original pixal match from colour match to background match due to anti aliasing colour mismatch.
       **/
      const canvas = this.refs.signatureCanvas.refs.cv;
      const ctx = canvas.getContext('2d');
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newColourRGB = hexToRgb(colour);
      for (let i = 0; i < imageData.data.length; i+=4) {
        if (imageData.data[i] !== 255 &&
          imageData.data[i+1] !== 255 &&
          imageData.data[i+2] !== 255) {
          imageData.data[i] = newColourRGB.r;
          imageData.data[i+1] = newColourRGB.g;
          imageData.data[i+2] = newColourRGB.b;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }

  handleClear = () => {
    this.refs.signatureCanvas.clear();
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
    const { className, onTabChange, onChange } = this.props;
    const { drawSignatureColour } = this.state;
    return (
      <div className={classNames(className, styles.drawPanelWrapper)}
        tabIndex={0}>
        <div className={styles.drawPanelButtons}>
          <SignatureTabs activeTab="draw" onTabChange={onTabChange} />
          <div className={styles.colourPicker}>
            <ColourPicker onChange={this.handleColourChange} />
          </div>
          <button className={styles.clearButton} onClick={this.handleClear}>
            <IoIosRefreshEmpty height={24} width={24} />
          </button>
          <div className="clearfix"></div>
        </div>
        <div className={styles.signatureWrapper}>
          <SignaturePad ref="signatureCanvas" penColor={drawSignatureColour} onBegin={onChange} />
          <div className={styles.guideLine}></div>
        </div>
      </div>
    );
  }
}

export default DrawSignature;
