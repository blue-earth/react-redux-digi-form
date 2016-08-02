import React, {
  Component,
  PropTypes
} from 'react';
import {
  findIndexById,
  findItemById
} from 'helpers/pureFunctions';
import {
  getDragSnappingTargets,
  getResizeSnappingTargets,
  getDragSnappingHelpersRect,
  getResizeSnappingHelpersPos,
  zoomValue
} from 'helpers/formBuilderHelper';
// import ResizableAndMovablePlus from 'components/ResizableAndMovablePlus';
// import classNames from 'classnames';
import InteractWrapper from 'components/InteractWrapper/InteractWrapper';
import _ from 'lodash';
import interact from 'interact.js';
import styles from './DrawingBoard.scss';

class DrawingBoard extends Component {

  constructor(props) {
    super(props);
    this.state = { isDrawing: false };
  };

  static propTypes = {
    /*
     * documents: Redux state to hold document image urls.
     */
    documents: PropTypes.array.isRequired,

    questions: PropTypes.array.isRequired,

    /*
     * saveElement: Redux action to save the current element being edited.
     */
    saveElement: PropTypes.func.isRequired,

    /*
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.array.isRequired,

    /*
     * currentQuestionId: Redux state that keeps the current active question ID.
     */
    currentQuestionId: PropTypes.number.isRequired,

    /*
     * setCurrentQuestionId: Redux action to set the current active question ID.
     */
    setCurrentQuestionId: PropTypes.func.isRequired,

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
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * deleteElement: Redux action to delete question element by id.
     */
    deleteElement: PropTypes.func.isRequired,

    /*
     * getPageDOM: Get page dom element by page number.
     */
    getPageDOM: PropTypes.func.isRequired
  };

  componentDidMount() {
    const element = this.refs.board;

    interact(element)
      .dropzone({
        accept: '.interactWrapper'
      })
      .on('drop', this.handleDrop);

    document.addEventListener('mousemove', this.handleBoardMouseMove);
    document.addEventListener('mouseup', this.handleBoardMouseUp);
  }

  handleDrop = (event) => {
    const { documentMapping, pageNumber } = this.props;
    const { relatedTarget } = event;
    var metaData = JSON.parse(relatedTarget.dataset.meta);
    if (!metaData.id) return;
    var mappingInfo = findItemById(documentMapping, metaData.id);
    if (mappingInfo.pageNumber === pageNumber) return;
    metaData.destPageNumber = pageNumber;
    relatedTarget.dataset.meta = JSON.stringify(metaData);
  }

  getMousePos(event) {
    var e = event || window.event; // Moz || IE
    if (e.pageX || e.pageY) { // Moz
      return { x: e.pageX, y: e.pageY };
    } else if (e.clientX || e.clientY) { // IE
      return { x: e.clientX, y: e.clientY };
    } else {
      return { x: 0, y: 0 };
    }
  }

  getElementPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx, y: ly};
  }

  getScrollPos() {
    const { containerId } = this.props;
    var el = document.querySelector('[data-id=' + containerId+ ']');
    return {
      x: el.scrollLeft,
      y: el.scrollTop
    };
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
    const { updateMappingInfo, pageZoom, pageNumber } = this.props;

    if (Math.abs(startX - endX) < 5 && Math.abs(startY - endY) < 5) {
      return; // no need to add too small-sized box.
    }

    updateMappingInfo({
      type: 'Standard',
      pageNumber,
      boundingBox: [{
        left: Math.min(startX, endX) / pageZoom,
        top: Math.min(startY, endY) / pageZoom,
        width: Math.abs(endX - startX) / pageZoom,
        height: Math.abs(endY - startY) / pageZoom
      }]
    });
  }

  /*
  handleResizeStart = (direction, styleSize, clientSize, event, metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleResizeStop = (direction, styleSize, clientSize, delta, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom } = this.props;
    const { id } = metaData;
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
    const { id } = metaData;
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
  */
  handleResizeStart = (metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleResizeMove = (rect, metaData, isSnapping) => {
    const { documentMapping, pageZoom } = this.props;

    if (isSnapping) {
      const helpersPos = getResizeSnappingHelpersPos(rect, metaData.id, documentMapping, pageZoom);
      this.setResizeSnappingHelpers(helpersPos);
    } else {
      this.resetSnappingHelper();
    }
  }

  handleResizeEnd = (rect, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom } = this.props;
    const { id } = metaData;
    const newBoundingBox = {
      left: rect.left / pageZoom,
      top: rect.top / pageZoom,
      width: rect.width / pageZoom,
      height: rect.height / pageZoom
    };
    if (id) {
      const boundingBox = findItemById(documentMapping, id).bounding_box[0];
      if (!_.isEqual(boundingBox, newBoundingBox)) {
        updateMappingInfo({
          id,
          boundingBox: [newBoundingBox]
        });
      }
    } else {
      updateMappingInfo({
        boundingBox: [newBoundingBox]
      });
    }
    // Reset SnappingHelper
    this.resetSnappingHelper();
  }

  handleDragStart = (metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleDragMove = (rect, metaData, isSnapping) => {
    const { documentMapping, pageZoom } = this.props;

    if (isSnapping) {
      const helpersRect = getDragSnappingHelpersRect(rect, metaData.id, documentMapping, pageZoom);
      this.setDragSnappingHelpers(helpersRect);
    } else {
      this.resetSnappingHelper();
    }
  }

  handleDragEnd = (rect, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom, pageNumber, getPageDOM } = this.props;
    const { id } = metaData;

    var newRect = rect;
    const { destPageNumber } = metaData;
    if (destPageNumber) {
      const destPage = getPageDOM(destPageNumber);
      const sourcePage = getPageDOM(pageNumber);
      newRect.top = rect.top > 0
        ? newRect.top - (destPage.offsetTop - sourcePage.offsetTop)
        : (sourcePage.offsetTop - destPage.offsetTop) + newRect.top;
    }
    const newBoundingBox = {
      left: newRect.left / pageZoom,
      top: newRect.top / pageZoom,
      width: newRect.width / pageZoom,
      height: newRect.height / pageZoom
    };

    if (id) {
      const boundingBox = findItemById(documentMapping, id).bounding_box[0];
      if (!_.isEqual(boundingBox, newBoundingBox)) {
        updateMappingInfo({
          id,
          pageNumber: destPageNumber && destPageNumber,
          boundingBox: [newBoundingBox]
        });
      }
    } else {
      updateMappingInfo({
        pageNumber: destPageNumber && destPageNumber,
        boundingBox: [newBoundingBox]
      });
    }

    // Reset SnappingHelper
    this.resetSnappingHelper();
  }

  setDragSnappingHelpers(helpersRect) {
    const snappingHelper = this.refs.snappingHelper;
    var innerHTML = '';
    helpersRect.map(rect => {
      var style = `left: ${rect.left}px; top: ${rect.top}px;` +
        `width: ${rect.width}px; height: ${rect.height}px;`;
      innerHTML += `<div class="dragSnappingHelper" style="${style}"></div>`;
    });
    snappingHelper.innerHTML = innerHTML;
  }

  setResizeSnappingHelpers(helpersPos) {
    const snappingHelper = this.refs.snappingHelper;
    var innerHTML = '';
    helpersPos.map(pos => {
      var style = `left: ${pos.x}px; top: ${pos.y}px; ${pos.type}: ${pos.size}px;`;
      innerHTML += `<div class="${pos.type}SnappingHelper" style="${style}"></div>`;
    });
    snappingHelper.innerHTML = innerHTML;
  }

  resetSnappingHelper() {
    const snappingHelper = this.refs.snappingHelper;
    snappingHelper.innerHTML = '';
  }

  handleElementClick = (metaData) => {
    const { currentQuestionId, setCurrentQuestionId } = this.props;
    currentQuestionId !== metaData.id && setCurrentQuestionId(metaData.id);
  }

  handleElementDoubleClick = (metaData) => {
    const { setQuestionEditMode } = this.props;
    setQuestionEditMode({
      id: metaData.id,
      mode: true
    });
  }

  handleKeyDown = (event) => {
    const { deleteElement, currentQuestionId, pageZoom, documentMapping, updateMappingInfo } = this.props;

    if (currentQuestionId > 0) {
      const boundingBox = findItemById(documentMapping, currentQuestionId).bounding_box[0];
      const newBoundingBox = _.assign({}, boundingBox);
      switch (event.keyCode) {
        case 37: // Left key
          newBoundingBox.left -= 1.0 / pageZoom;
          break;
        case 38: // Up key
          newBoundingBox.top -= 1.0 / pageZoom;
          break;
        case 39: // Right key
          newBoundingBox.left += 1.0 / pageZoom;
          break;
        case 40: // Down key
          newBoundingBox.top += 1.0 / pageZoom;
          break;
        case 46: // Delete key
          deleteElement(currentQuestionId);
          return;
        default:
          return;
      }
      updateMappingInfo({
        boundingBox: [newBoundingBox]
      });
      event.preventDefault();
    }
  }

  renderDocuments() {
    const { documents, pageZoom } = this.props;
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
    });
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
      const myDocumentMapping = _.filter(documentMapping, {
        'page_number': pageNumber
      });
      return myDocumentMapping.map((mappingInfo) => {
        const boundingBox = mappingInfo.bounding_box[0];
        var index = findIndexById(questions, mappingInfo.id);
        const { type } = questions[index];
        const isActive = mappingInfo.id === currentQuestionId;
        const zIndex = isActive ? 101 : 100;
        /*
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
        */
        return (
          <InteractWrapper
            x={zoomValue(boundingBox.left, pageZoom)}
            y={zoomValue(boundingBox.top, pageZoom)}
            zIndex={zIndex}
            active={isActive}
            className="interactWrapper"
            width={zoomValue(boundingBox.width, pageZoom)}
            height={zoomValue(boundingBox.height, pageZoom)}
            onResizeStart={this.handleResizeStart}
            onResizeMove={this.handleResizeMove}
            onResizeEnd={this.handleResizeEnd}
            onDragStart={this.handleDragStart}
            onDragMove={this.handleDragMove}
            onDragEnd={this.handleDragEnd}
            onClick={this.handleElementClick}
            onDoubleClick={this.handleElementDoubleClick}
            key={`${mappingInfo.id}-${0}`}
            minWidth={10}
            minHeight={10}
            metaData={{
              id: mappingInfo.id,
              subId: 0
            }}
            dragSnapTargets={getDragSnappingTargets(documentMapping, mappingInfo.id, pageZoom)}
            resizeSnapTargets={getResizeSnappingTargets(documentMapping, mappingInfo.id, pageZoom)}
          >
            <div className={styles.elementName}>{type}</div>
          </InteractWrapper>
        );
      });
    };
    return (
      <div className={styles.board}
        onMouseDown={this.handleBoardMouseDown}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
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
            }}>
          </div>
        }
        <div className={styles.snappingHelper} ref="snappingHelper"></div>
      </div>
    );
  }
}

export default DrawingBoard;
