import React, {
  Component,
  PropTypes
} from 'react';
import {
  getArrangedBlocksPosition,
  getDragSnappingTargets,
  getResizeSnappingTargets,
  getDragSnappingHelpersRect,
  getResizeSnappingHelpersPos,
  isCurrentElementId,
  zoomValue
} from 'helpers/formBuilderHelper';
// import ResizableAndMovablePlus from 'components/ResizableAndMovablePlus';
// import classNames from 'classnames';
import InteractWrapper from 'components/InteractWrapper';
import BlockMappingToolbar from 'components/Toolbars/BlockMappingToolbar';
import StandardMappingToolbar from 'components/Toolbars/StandardMappingToolbar';
import _ from 'lodash';
import interact from 'interact.js';
import styles from './DrawingBoard.scss';
import {
  formBuilderBox,
  formBuilderSelectMode,
  formBuilderBoxMappingType
} from 'constants/formBuilder';

class DrawingBoard extends Component {
  static propTypes = {
    /*
     * documents: Redux state to hold document image urls.
     */
    documents: PropTypes.array.isRequired,

    /*
     * questions: Redux state to store the array of questions.
     */
    questions: PropTypes.array.isRequired,

    /*
     * isModified: Redux state that indicates whether the form is modified since last save or load.
     */
    isModified: PropTypes.bool.isRequired,

    /*
     * saveElement: Redux action to save the current element being edited.
     */
    saveElement: PropTypes.func.isRequired,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.object.isRequired,

    /*
     * setMappingInfo: Action to update the document mapping info.
     */
    setMappingInfo: PropTypes.func.isRequired,

    /*
     * setMappingPositionInfo: Action to update the document mapping position info of active selection.
     */
    setMappingPositionInfo: PropTypes.func.isRequired,

    /*
     * setActiveBox: Redux action to set activeBoxPath path.
     */
    setActiveBox: PropTypes.func.isRequired,

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
     * One of formBuilderSelectMode
     */
    questionEditMode: PropTypes.number.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * getPageDOM: Get page dom element by page number.
     */
    getPageDOM: PropTypes.func.isRequired,

    /*
     * currentElement: Redux state to hold the element currently being edited.
     */
    currentElement: PropTypes.object,

    /*
     * setCurrentElement: Redux action to set/load currentElement
     */
    setCurrentElement: PropTypes.func.isRequired,

    /*
     * show: Redux modal show
     */
    show: PropTypes.func.isRequired,

    /*
     * viewportHeight: Page viewport height
     */
    viewportHeight: PropTypes.number.isRequired,

    /*
     * viewportWidth: Page viewport width
     */
    viewportWidth: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      isDragging: false,
      isResizing: false
    };
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
    const { pageNumber, currentElement } = this.props;
    const { relatedTarget } = event;
    var metaData = JSON.parse(relatedTarget.dataset.meta);
    if (!currentElement) return;
    const { mappingInfo } = currentElement;
    if (mappingInfo.page_umber === pageNumber) return;
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
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);
    if (!activeBoxPath || event.button !== 0) return; // mouse left button
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
    const { setMappingPositionInfo, pageZoom, pageNumber } = this.props;

    if (Math.abs(startX - endX) < 5 && Math.abs(startY - endY) < 5) {
      return; // no need to add too small-sized box.
    }
    setMappingPositionInfo({
      'page': pageNumber,
      'box': [
        Math.min(startX, endX) / pageZoom,
        Math.min(startY, endY) / pageZoom,
        Math.abs(endX - startX) / pageZoom,
        Math.abs(endY - startY) / pageZoom
      ]
    });
  }

  handleResizeStart = (metaData) => {
    this.setState({ isResizing: true });
  }

  handleResizeMove = (rect, metaData, isSnapping) => {
    const { documentMapping, pageZoom, currentElement } = this.props;

    if (isSnapping) {
      const helpersPos = getResizeSnappingHelpersPos(rect, currentElement, documentMapping, pageZoom);
      this.setResizeSnappingHelpers(helpersPos);
    } else {
      this.resetSnappingHelper();
    }
  }

  handleResizeEnd = (rect, metaData) => {
    const { currentElement, setMappingPositionInfo, pageZoom } = this.props;
    const { activeBoxPath } = currentElement;

    this.setState({ isResizing: false });
    const box = [
      rect.left / pageZoom,
      rect.top / pageZoom,
      rect.width / pageZoom,
      rect.height / pageZoom
    ];

    const position = _.get(currentElement.mappingInfo, activeBoxPath);
    const blocks = getArrangedBlocksPosition(box, _.size(position.blocks));

    setMappingPositionInfo({ blocks, box });

    // Reset SnappingHelper
    this.resetSnappingHelper();
  }

  handleDragStart = (metaData) => {
    this.setState({ isDragging: true });
  }

  handleDragMove = (rect, metaData, isSnapping) => {
    const { documentMapping, pageZoom, currentElement } = this.props;

    if (isSnapping) {
      const helpersRect = getDragSnappingHelpersRect(rect, currentElement, documentMapping, pageZoom);
      this.setDragSnappingHelpers(helpersRect);
    } else {
      this.resetSnappingHelper();
    }
  }

  handleDragEnd = (rect, metaData) => {
    const { setMappingPositionInfo, pageZoom, pageNumber, getPageDOM } = this.props;
    this.setState({ isDragging: false });
    var newRect = rect;
    const { destPageNumber } = metaData;
    if (destPageNumber) {
      const destPage = getPageDOM(destPageNumber);
      const sourcePage = getPageDOM(pageNumber);
      newRect.top = rect.top > 0
        ? newRect.top - (destPage.offsetTop - sourcePage.offsetTop)
        : (sourcePage.offsetTop - destPage.offsetTop) + newRect.top;
    }
    const box = [
      newRect.left / pageZoom,
      newRect.top / pageZoom,
      newRect.width / pageZoom,
      newRect.height / pageZoom
    ];

    setMappingPositionInfo({
      'page': destPageNumber && destPageNumber,
      'box': box
    });

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

  handleBoxClick = (metaData) => {
    const { setCurrentElement, setQuestionEditMode, setActiveBox,
      currentElement, isModified, show } = this.props;
    if (isCurrentElementId(metaData.id, currentElement)) {
      setActiveBox(metaData.path);
    } else {
      if (isModified && currentElement) {
        show('cancelConfirmModal');
      } else {
        setQuestionEditMode(formBuilderSelectMode.QUESTION_DETAIL_VIEW);
        setCurrentElement({
          id: parseInt(metaData.id, 10),
          activeBoxPath: metaData.path
        });
      }
    }
  };

  handleKeyDown = (event) => {
    const { currentElement, pageZoom, setMappingPositionInfo } = this.props;

    if (!currentElement) return;
    const { activeBoxPath } = currentElement;
    const position = _.get(currentElement.mappingInfo, activeBoxPath);
    if (!position) return;
    const box = position.box;
    if (!box) return;
    const { LEFT, TOP } = formBuilderBox;
    const newBox = _.slice(box);

    switch (event.keyCode) {
      case 37: // Left key
        newBox[LEFT] -= 1.0 / pageZoom;
        break;
      case 38: // Up key
        newBox[TOP] -= 1.0 / pageZoom;
        break;
      case 39: // Right key
        newBox[LEFT] += 1.0 / pageZoom;
        break;
      case 40: // Down key
        newBox[TOP] += 1.0 / pageZoom;
        break;
      case 46: // Delete key
        this.handleDeleteBox();
        return;
      default:
        return;
    }
    setMappingPositionInfo({ box: newBox });
    event.preventDefault();
  }

  handleToolbarSave = () => {
    const { saveElement, setActiveBox } = this.props;
    saveElement();
    setActiveBox(null);
  }

  handleDeleteBox = () => {
    const { currentElement, setMappingInfo } = this.props;
    if (!currentElement) return;
    const mappingInfo = _.assign({}, currentElement.mappingInfo);
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);
    setMappingInfo(_.unset(mappingInfo, activeBoxPath));
  }

  renderBlocks(position) {
    const { pageZoom } = this.props;
    const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
    if (_.isEmpty(position.blocks)) {
      const style = {
        fontSize: position.font_size
      };
      return (
        <div className={styles.boxLabel} style={style}>
          {'D'}
        </div>
      );
    } else {
      const style = {
        fontSize: position.font_size,
        height: zoomValue(position.box[HEIGHT], pageZoom)
      };
      const blocks = _.map(position.blocks, (block, index) => {
        const boxStyle = {
          left: zoomValue(block[LEFT], pageZoom),
          top: zoomValue(block[TOP], pageZoom),
          width: zoomValue(block[WIDTH], pageZoom),
          height: zoomValue(block[HEIGHT], pageZoom)
        };
        return (
          <div key={index} className={styles.block} style={boxStyle}>
            <div className={styles.blockLabel}>
              {'X'}
            </div>
          </div>
        );
      });
      return (
        <div className={styles.blocks} style={style}>
          {blocks}
        </div>
      );
    }
  }

  belongsToPage(position) {
    const { pageNumber } = this.props;
    return position && position.page === pageNumber;
  }

  renderDocumentMappingComponents() {
    // todo: Fix this, disable this function temporary to get other parts working
    const { documentMapping, currentElement, pageZoom,
      viewportWidth, viewportHeight } = this.props;
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);
    const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;
    var boardOptionals = {};
    if (activeBoxPath) {
      boardOptionals['style'] = _.merge(boardOptionals['style'], {
        cursor: 'crosshair'
      });
    }

    const finalMapping = currentElement
      ? _.assign({}, documentMapping, {
        [currentElement.id || 0]: currentElement.mappingInfo
      })
      : documentMapping;

    return Object.keys(finalMapping).map(id => {
      const mappingInfo = finalMapping[id];
      return mappingInfo && Object.keys(mappingInfo).map((label) => {
        const positions = mappingInfo[label].positions;
        return positions && Object.keys(positions).map((positionKey) => {
          const position = positions[positionKey];
          if (!this.belongsToPage(position)) {
            return false; // skip if the mapping is not for this page
          }
          const isActive = false;
          const box = position.box;
          const zIndex = isActive ? 101 : 100;
          const path = _.join([label, 'positions', positionKey], '.');
          if (isCurrentElementId(id, currentElement) && _.isEqual(path, activeBoxPath)) {
            return false; // skip & let draw active box in below function.
          }
          return (
            <InteractWrapper
              x={zoomValue(box[LEFT], pageZoom)}
              y={zoomValue(box[TOP], pageZoom)}
              zIndex={zIndex}
              active={isActive}
              className="interactWrapper"
              width={zoomValue(box[WIDTH], pageZoom)}
              height={zoomValue(box[HEIGHT], pageZoom)}
              minWidth={10}
              minHeight={10}
              onClick={this.handleBoxClick}
              metaData={{ id, path }}
              viewportWidth={viewportWidth}
              viewportHeight={viewportHeight}
            >
              {this.renderBlocks(position)}
            </InteractWrapper>
          );
        });
      });
    });
  }

  renderToolbar() {
    const { currentElement, pageZoom, setMappingPositionInfo,
      viewportWidth, viewportHeight } = this.props;
    const { isDragging, isResizing } = this.state;

    if (!currentElement) return false;
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);

    const position = _.get(currentElement.mappingInfo, activeBoxPath);
    if (!this.belongsToPage(position)) return false;

    const toolbarProps = {
      values: position,
      onChange: setMappingPositionInfo,
      onDelete: this.handleDeleteBox,
      onSave: this.handleToolbarSave,
      pageZoom,
      viewportWidth,
      viewportHeight
    };

    if (!currentElement || isDragging || isResizing) return false;
    if (_.isEqual(currentElement.defaultMappingType, formBuilderBoxMappingType.STANDARD)) {
      return <StandardMappingToolbar {...toolbarProps} />;
    } else if (_.isEqual(currentElement.defaultMappingType, formBuilderBoxMappingType.BLOCK)) {
      return <BlockMappingToolbar {...toolbarProps} />;
    } else {
      return false;
    }
  }

  renderActiveBox() {
    const { documentMapping, pageZoom, currentElement,
      viewportWidth, viewportHeight } = this.props;
    if (!currentElement) return false;
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);

    const position = _.get(currentElement.mappingInfo, activeBoxPath);
    if (!this.belongsToPage(position)) return false;
    const isActive = true;
    const box = position.box;
    const zIndex = isActive ? 101 : 100;
    const { LEFT, TOP, WIDTH, HEIGHT } = formBuilderBox;

    return (
      <InteractWrapper
        x={zoomValue(box[LEFT], pageZoom)}
        y={zoomValue(box[TOP], pageZoom)}
        zIndex={zIndex}
        active={isActive}
        className="interactWrapper"
        width={zoomValue(box[WIDTH], pageZoom)}
        height={zoomValue(box[HEIGHT], pageZoom)}
        minWidth={10}
        minHeight={10}
        onResizeStart={this.handleResizeStart}
        onResizeMove={this.handleResizeMove}
        onResizeEnd={this.handleResizeEnd}
        onDragStart={this.handleDragStart}
        onDragMove={this.handleDragMove}
        onDragEnd={this.handleDragEnd}
        viewportWidth={viewportWidth}
        viewportHeight={viewportHeight}
        dragSnapTargets={getDragSnappingTargets(documentMapping, currentElement, pageZoom)}
        resizeSnapTargets={getResizeSnappingTargets(documentMapping, currentElement, pageZoom)}
        metaData={{ id: currentElement.id, path: activeBoxPath }}
      >
        {this.renderBlocks(position)}
      </InteractWrapper>
    );
  }

  render() {
    const activeBoxPath = _.get(this.props, ['currentElement', 'activeBoxPath']);
    const { isDrawing, startX, startY, endX, endY } = this.state;
    var boardOptionals = {};
    if (activeBoxPath) {
      boardOptionals['style'] = _.merge(boardOptionals['style'], {
        cursor: 'crosshair'
      });
    }

    return (
      <div className={styles.board}
        onMouseDown={this.handleBoardMouseDown}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        ref="board"
        {...boardOptionals}>

        {this.renderDocumentMappingComponents()}
        {this.renderActiveBox()}
        {this.renderToolbar()}
        {isDrawing &&
          <div className={styles.newBoxDraw}
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
