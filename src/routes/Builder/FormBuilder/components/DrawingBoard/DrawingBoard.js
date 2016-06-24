import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import { findIndexById } from 'helpers/pureFunctions';
import ResizableAndMovablePlus from 'components/ResizableAndMovablePlus';
import { Button } from 'react-bootstrap';
import { MdZoomIn, MdZoomOut, MdSettingsOverscan, MdZoomOutMap } from 'react-icons/lib/md';
import classNames from 'classnames';
import _ from 'lodash';
import styles from './DrawingBoard.scss';

class DrawingBoard extends Component {

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
    documentMapping: PropTypes.array.isRequired,

    /*
     * updateMappingInfo: Action to update the document mapping info.
     */
    updateMappingInfo: PropTypes.func.isRequired,

    /*
     * pageZoom: Redux state to keep the page zoom ratio.
     */
    pageZoom: PropTypes.number.isRequired,

    /*
     * pageNumber: Page number of the documents(image number).
     */
    pageNumber: PropTypes.number.isRequired,

    /*
     * containerId: Pages wrapper id, specified in data-id.
     */
    containerId: PropTypes.string.isRequired,

    /*
     * questionEditMode: Redux state to indicate question edit mode
     */
    questionEditMode: PropTypes.bool.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired
  };

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

  getScrollPos() {
    const { containerId } = this.props;
    var el = document.querySelector("[data-id=" + containerId+ "]");
    return {
      x: el.scrollLeft,
      y: el.scrollTop
    }
  }

  handleBoardMouseDown = (event) => {
    const { activeInputName } = this.props;
    if (!activeInputName || event.button !== 0) return; // mouse left button
    const board = this.refs.board;
    const orgPos = this.getElementPos(board);
    const mousePos = this.getMousePos(event);
    const scrollPos = this.getScrollPos();
    const startX = mousePos.x - orgPos.x + scrollPos.x;
    const startY = mousePos.y - orgPos.y + scrollPos.y;
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
    const scrollPos = this.getScrollPos();
    this.setState({
      endX: mousePos.x - orgPos.x + scrollPos.x,
      endY: mousePos.y - orgPos.y + scrollPos.y
    });
  }

  handleBoardMouseUp = (event) => {
    if (event.button !== 0 || !this.state.isDrawing) return; // mouse left button
    const board = this.refs.board;
    const orgPos = this.getElementPos(board);
    const mousePos = this.getMousePos(event);
    const scrollPos = this.getScrollPos();
    const { startX, startY } = this.state;
    var endX = mousePos.x - orgPos.x + scrollPos.x;
    var endY = mousePos.y - orgPos.y + scrollPos.y;
    this.setState({
      isDrawing: false,
      endX,
      endY 
    });
    const { addElement, activeInputName, pageZoom, pageNumber } = this.props;

    if (Math.abs(startX - endX) < 5 && Math.abs(startY - endY) < 5) {
      return; // no need to add too small-sized box.
    }

    addElement({
      question: {
        type: activeInputName
      },
      mappingInfo: {
        type: 'Standard',
        pageNumber,
        bounding_box: [{
          left: Math.min(startX, endX) / pageZoom,
          top: Math.min(startY, endY) / pageZoom,
          width: Math.abs(endX - startX) / pageZoom,
          height: Math.abs(endY - startY) / pageZoom
        }]
      }
    });
  }

  handleResizeStart = (direction, styleSize, clientSize, event, metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleResizeStop = (direction, styleSize, clientSize, delta, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom, pageNumber } = this.props;
    const { id, subId } = metaData;
    const index = findIndexById(documentMapping, id);
    const boundingBox = documentMapping[index].bounding_box[0];
    var newLeft = boundingBox.left;
    var newTop = boundingBox.top;
    if (direction === 'left' || direction === 'topLeft' || direction === 'bottomLeft') {
      newLeft -= delta.width / pageZoom;
    }
    if (direction === 'top' || direction === 'topLeft' || direction === 'topRight') {
      newTop -= delta.height / pageZoom;
    }
    const newBoundingBox = {
      left: newLeft,
      top: newTop,
      width: styleSize.width / pageZoom,
      height: styleSize.height / pageZoom
    };
    if (!_.isEqual(boundingBox, newBoundingBox)) {
      updateMappingInfo({
        id,
        bounding_box: [newBoundingBox]
      });
    }
  }

  handleDragStart = (event, ui, metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    event.stopPropagation();
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleDragStop = (event, ui, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom } = this.props;
    const { id, subId } = metaData;
    const index = findIndexById(documentMapping, id);
    const boundingBox = documentMapping[index].bounding_box[0];
    const newBoundingBox = {
      left: ui.position.left / pageZoom,
      top: ui.position.top / pageZoom,
      width: boundingBox.width,
      height: boundingBox.height
    };
    if (!_.isEqual(boundingBox, newBoundingBox)) {
      updateMappingInfo({
        id,
        bounding_box: [newBoundingBox]
      });
    }
  }

  handleElementClick = (metaData) => {
    // const { setCurrentQuestionId } = this.props;
    // setCurrentQuestionId(metaData.id);
  }

  handleElementDoubleClick = (metaData) => {
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode({
      id: metaData.id,
      mode: true
    });
  }

  renderDocuments() {
    const { questions, documents, pageZoom } = this.props;
    return documents.map((document, index) => {
      const zoomedWidth = document.width * pageZoom;
      const pageStyle = {width: zoomedWidth};
      return (
        <div className={styles.page} key={index}
          style={pageStyle}>
          <img src={document.url} alt={`Page Image ${index + 1}`} 
            className={styles.pageImage} ref={`pageImage${index + 1}`} />
        </div>
      );
    })
  }

  render() {
    const { activeInputName, documentMapping, questions, currentQuestionId,
      pageZoom, pageNumber } = this.props;
    const { isDrawing, startX, startY, endX, endY } = this.state;
    var boardOptionals = {};
    if (activeInputName) {
      boardOptionals['style'] = _.merge(boardOptionals['style'], {
        cursor: 'crosshair'
      });
    }
    var documentMappingComponents = () => {
      const myDocumentMapping = _.filter(documentMapping, {pageNumber});
      return myDocumentMapping.map((mappingInfo) => {
        const boundingBox = mappingInfo.bounding_box[0];
        var index = findIndexById(questions, mappingInfo.id);
        const { type } = questions[index];
        const isActive = mappingInfo.id === currentQuestionId;
        const zIndex = isActive ? 101 : 100;
        const elementClass = classNames({
          [styles.element]: true,
          [styles.active]: isActive
        });
        return (
          <ResizableAndMovablePlus
            className={elementClass}
            x={boundingBox.left * pageZoom}
            y={boundingBox.top * pageZoom}
            zIndex={zIndex}
            width={boundingBox.width * pageZoom}
            height={boundingBox.height * pageZoom}
            onResizeStart={this.handleResizeStart}
            onResizeStop={this.handleResizeStop}
            onDragStart={this.handleDragStart}
            onDragStop={this.handleDragStop}
            onClick={this.handleElementClick}
            onDoubleClick={this.handleElementDoubleClick}
            key={`${mappingInfo.id}-${0}`}
            minWidth={10}
            minHeight={10}
            tabIndex={0}
            metaData={{
              id: mappingInfo.id,
              subId: 0
            }}
          >
            <div className={styles.elementName}>{type}</div>
          </ResizableAndMovablePlus>
        );
      });
    }
    return (
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
    )
  }
}

export default DrawingBoard;
