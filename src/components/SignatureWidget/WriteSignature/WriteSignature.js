import React, {
  Component,
  PropTypes
} from 'react';
import FloatTextInput from 'components/QuestionInputs/FloatTextInput';
import ColourPicker from '../ColourPicker';
import SigantureTabButton from '../SignatureTabs';
import classNames from 'classnames';
import styles from './WriteSignature.scss';
import { signatureFonts } from 'schemas/signatureSchema';

class WriteSignature extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    onTabChange: PropTypes.func
  }
  static defaultProps = {
    onTabChange: () => {},
    onChange: () => {},
    className: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      writeSignatureColour: '#000000',
      signatureName: '',
      signatureStyle: signatureFonts[0].name
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWriteCanvasesResize);
    this.handleWriteCanvasesResize(); // Initializer for write canvases.
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWriteCanvasesResize);
  }

  get dataUrl() {
    const { signatureStyle, signatureName } = this.state;
    if (signatureName.length === 0) {
      return '';
    }
    const canvas = this.refs[`writeSignature-${signatureStyle}`];
    return canvas.toDataURL();
  }

  handleWriteCanvasesResize = () => {
    signatureFonts.map((font) => {
      var writeCanvas = this.refs[`writeSignature-${font.name}`];
      writeCanvas.width = (writeCanvas.parentElement.offsetWidth - 4) * 2;
      writeCanvas.height = (writeCanvas.parentElement.offsetHeight - 4) * 2;
    });
    this.updateWriteSignatureCanvases();
  }

  handleSelectActiveColour = (colour) => {
    this.setState({
      writeSignatureColour: colour
    }, this.updateWriteSignatureCanvases);
  }
  handleSignatureStyleChange = (value) => {
    this.setState({
      signatureStyle: value
    }, this.updateWriteSignatureCanvases);
  }
  hanldeSignatureNameChange = (value) => {
    this.setState({
      signatureName: value
    }, this.updateWriteSignatureCanvases);
  }

  /**
  * Redraw write signature panel canvas according to updated params (textWidth, color, canvasSize etc.).
  */
  updateWriteSignatureCanvases = () => {
    const { writeSignatureColour, signatureName } = this.state;
    signatureFonts.map((font) => {
      const signatureStyle = font.name;
      const canvas = this.refs[`writeSignature-${signatureStyle}`];
      let ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      let adjustedHeight = font.size;
      ctx.font = `${adjustedHeight}px ${signatureStyle}`;
      let textWidth = ctx.measureText(signatureName).width;
      if (textWidth > width - 100) {
        adjustedHeight = parseInt(adjustedHeight * (width - 100) / textWidth);
      }
      ctx.font = `${adjustedHeight}px ${signatureStyle}`;
      textWidth = ctx.measureText(signatureName).width;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = writeSignatureColour;
      ctx.fillText(signatureName, (width-textWidth) / 2, canvas.height * 0.5);
    });
  }

  render() {
    const { className, onTabChange } = this.props;
    const { signatureStyle, signatureName } = this.state;
    return (
      <div className={classNames(className, styles.writePanelWrapper)}>
        <div className={styles.signaturePanelHeader}>
          <div className="pull-left">
            <SigantureTabButton onTabChange={onTabChange} activeTab="write" />
          </div>
          <FloatTextInput
            extraClass={styles.nameInputWrapper}
            backgroundColour="#f5f6fa"
            placeholder="Text as signature"
            size="md"
            autoFocus
            value={signatureName}
            onChange={this.hanldeSignatureNameChange} />
          <div className={styles.colourPicker}>
            <ColourPicker onChange={this.handleSelectActiveColour} />
          </div>
        </div>
        <ul style={{padding: '0', margin: '0', listStyle: 'none'}}>
          {signatureFonts.map((font, index) => {
            let handleClick = this.handleSignatureStyleChange.bind(this, font.name); // eslint-disable-line
            return (
              <li key={`signature-panel-${index}`} className={classNames(
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
                  onClick={handleClick}>
                  <div className={styles.signatureCanvasWrapper}>
                    <canvas className={styles.signaturePanelCanvas}
                      ref={`writeSignature-${font.name}`}>
                    </canvas>
                  </div>
                  <div className={styles.signatureTypeWrapper}>
                    <div className="pull-left">{font.label}</div>
                    <div className={classNames(`preload-${font.name}`, styles.signatureTypeLabel)}>
                      {font.label}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default WriteSignature;
