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
    this.setState({
      drawSignatureColour: colour
    });
    this.refs.signatureCanvas.penColor = colour;
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
