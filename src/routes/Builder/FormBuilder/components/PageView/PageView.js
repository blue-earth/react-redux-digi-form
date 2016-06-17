import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import styles from './PageView.scss'
import ResizableAndMovable from 'react-resizable-and-movable';

class PageView extends Component {

  constructor(props) {
    super(props);
    this.state = {isDrawing: false};
  };

  static propTypes = {
    /*
     * documents: Redux state to hold document image urls.
     */
    documents: PropTypes.array.isRequired,

    /*
     * addElement: used to set active input element selected, and enables to draw on the right
     */
    addElement: PropTypes.func.isRequired,

    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.array.isRequired
  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

  }

  getMousePos(event) {
    var e = event || window.event; //Moz || IE
    if (e.pageX || e.pageY) //Moz
      return { x: e.pageX, y: e.pageY };
    else if (e.clientX || e.clientY) //IE
      return { x: e.clientX, y: e.clientY };
    else
      return { x: 0, y: 0 };
  }
  getElementPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
  }

  handleBoardMouseDown = (event) => {
    const { activeInputName } = this.props;
    if (!activeInputName || event.button !== 0) return; // mouse left button
    const board = this.refs.board;
    const orgPos = this.getElementPos(board);
    const mousePos = this.getMousePos(event);
    const startX = mousePos.x - orgPos.x + board.offsetParent.scrollLeft;
    const startY = mousePos.y - orgPos.y + board.offsetParent.scrollTop;
    this.setState({
      isDrawing: true,
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  }

  handleBoardMouseMove = (event) => {
    if (event.buttons !== 1 || !this.state.isDrawing) return; // mouse left button
    const board = this.refs.board;
    const orgPos = this.getElementPos(board);
    const mousePos = this.getMousePos(event);
    this.setState({
      endX: mousePos.x - orgPos.x + board.offsetParent.scrollLeft,
      endY: mousePos.y - orgPos.y + board.offsetParent.scrollTop
    });
  }

  handleBoardMouseUp = (event) => {
    if (event.button !== 0 || !this.state.isDrawing) return; // mouse left button
    const board = this.refs.board;
    const orgPos = this.getElementPos(board);
    const mousePos = this.getMousePos(event);
    const { startX, startY } = this.state;
    var endX = mousePos.x - orgPos.x + board.offsetParent.scrollLeft;
    var endY = mousePos.y - orgPos.y + board.offsetParent.scrollTop;
    this.setState({
      isDrawing: false,
      endX,
      endY 
    });
    const { addElement, activeInputName } = this.props;

    if (startX === endX && startY === endY) return; // no need to add zero sized box.
    addElement({
      question: {
        type: activeInputName
      },
      mappingInfo: {
        type: 'Standard',
        bounding_box: [{
          left: Math.min(startX, endX),
          top: Math.min(startY, endY),
          width: Math.abs(endX - startX),
          height: Math.abs(endY - startY)
        }]
      }
    });
  }

  handleDragStart = (event, ui) => {
    event.stopPropagation();
  }

  renderDocuments() {
    const { documents } = this.props;
    return documents.map((document, index) => {
      return (
        <div className={styles.page} key={index}>
          <img className={styles.pageImage} src={document} alt="" />
        </div>
      );
    });
  }

  render() {
    const { activeInputName, documentMapping } = this.props;
    const { isDrawing, startX, startY, endX, endY } = this.state;
    var boardOptionals = {};
    if (activeInputName) {
      boardOptionals['style'] = {
        cursor: 'crosshair'
      }
    }
    var documentMappingComponents = () => {
      return documentMapping.map((mappingInfo, index) => {
        const boundingBox = mappingInfo.bounding_box[0];
        console.log(boundingBox)
        return (
          <ResizableAndMovable
            className={styles.element}
            x={boundingBox.left}
            y={boundingBox.top}
            width={boundingBox.width}
            height={boundingBox.height}
            onDragStart={this.handleDragStart}
            key={`${index}-${0}`}
          >
            <div className={styles.elementName}>Example</div>
          </ResizableAndMovable>
        );
      });
    }
    return (
      <div className={styles.pageView}>
        {this.renderDocuments()}
        <div className={styles.board}
          onMouseDown={this.handleBoardMouseDown}
          onMouseMove={this.handleBoardMouseMove}
          onMouseUp={this.handleBoardMouseUp}
          ref="board"
          {...boardOptionals}>

          {documentMappingComponents()}

          {isDrawing &&
            <div className={styles.newElementDraw}
            style={{
              left: Math.min(startX, endX),
              top: Math.min(startY, endY),
              width: Math.abs(endX - startX),
              height: Math.abs(endY - startY)
            }}></div>
          }
        </div>
      </div>
    )
  }
}

export default PageView;
