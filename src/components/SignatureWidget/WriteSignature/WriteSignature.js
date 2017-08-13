import React, {
  Component,
  PropTypes
} from 'react';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './WriteSignature.scss';

const colours = {
  black: '#000000',
  blue: '#3993d1',
  red: '#d45644'
};

const signatureFonts = [
  {
    label: 'Steve Jobs',
    name: 'Steve',
    size: 120
  }, {
    label: 'Hillary Rodham Clinton',
    name: 'Clinton',
    size: 150
  }, {
    label: 'Donald Trump',
    name: 'Trump',
    size: 150
  }, {
    label: 'Taylor Swift',
    name: 'Swift',
    size: 150
  }, {
    label: 'Abraham Lincoln',
    name: 'Lincoln',
    size: 150
  }, {
    label: 'Michelle Obama',
    name: 'Obama',
    size: 150
  }
];

class WriteSignature extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    signatureName: PropTypes.string
  }
  static defaultProps = {
    onChange: () => {},
    signatureName: '',
    className: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      writeSignatureColour: 'black',
      signatureName: props.signatureName,
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      signatureName: nextProps.signatureName
    }, this.updateWriteSignatureCanvases);
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
      ctx.fillStyle = colours[writeSignatureColour];
      ctx.fillText(signatureName, (width-textWidth) / 2, canvas.height * 0.5);
    });
  }

  render() {
    const { className } = this.props;
    const { signatureStyle, writeSignatureColour } = this.state;
    const preloadFonts = signatureFonts.map((font, index) => {
      return <div className={`signature-font-preload preload-${font.name}`} key={index}>font</div>;
    });
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
    return (
      <div className={classNames(className, styles.writePanelWrapper)}>
        <div className={classNames(styles.tabPanelTitle, 'invisible')}>Like a celebrity</div>
        {writeSignatureColourSelection}
        {preloadFonts}
        {signatureFonts.map((font, index) => {
          let handleClick = this.handleSignatureStyleChange.bind(this, font.name); // eslint-disable-line
          return (
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
                onClick={handleClick}>
                <canvas className={styles.signaturePanelCanvas}
                  ref={`writeSignature-${font.name}`}>
                </canvas>
              </div>
              <div className={classNames(styles.signatureTypeLabel, `preload-${font.name}`)}>
                {font.label}
              </div>
            </Col>
          );
        })}
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default WriteSignature;
