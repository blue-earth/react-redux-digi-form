import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import styles from './PageView.scss';
import { findIndexById } from 'helpers/pureFunctions';
import ResizableAndMovablePlus from 'components/ResizableAndMovablePlus';
import { Button } from 'react-bootstrap';
import { MdZoomIn, MdZoomOut, MdSettingsOverscan, MdZoomOutMap } from 'react-icons/lib/md';
import classNames from 'classnames';
import _ from 'lodash';

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
     * setPageZoom: Redux action to set page zoom ratio.
     */
    setPageZoom: PropTypes.func.isRequired,

    /*
     * pageWidth: Redux state to keep the page zoom ratio.
     */
    pageWidth: PropTypes.number.isRequired
  };

  componentWillMount() {

  }

  componentDidMount() {
    // if (this.refs.pageImage1) {
    //   var pageImage1 = this.refs.pageImage1;
    //   console.log(pageImage1.naturalWidth);
    // }
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
    const { addElement, activeInputName, pageZoom } = this.props;

    if (Math.abs(startX - endX) < 5 && Math.abs(startY - endY) < 5) {
      return; // no need to add too small-sized box.
    }

    addElement({
      question: {
        type: activeInputName
      },
      mappingInfo: {
        type: 'Standard',
        bounding_box: [{
          left: Math.min(startX, endX) / pageZoom,
          top: Math.min(startY, endY) / pageZoom,
          width: Math.abs(endX - startX) / pageZoom,
          height: Math.abs(endY - startY) / pageZoom
        }]
      }
    });
  }

  handleDragStart = (event, ui, metaData) => {
    event.stopPropagation();
    const { setCurrentQuestionId } = this.props;
    setCurrentQuestionId(metaData.id);
  }

  handleResizeStop = (direction, styleSize, clientSize, delta, metaData) => {
    const { updateMappingInfo, documentMapping, pageZoom } = this.props;
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

  handleClickZoomIn = () => {
    const { pageZoom, setPageZoom } = this.props;
    setPageZoom(Math.min(pageZoom + 0.25, 4));
  }

  handleClickZoomOut = () => {
    const { pageZoom, setPageZoom } = this.props;
    setPageZoom(Math.max(pageZoom - 0.25, 0.25));
  }
  
  handleClickFitWidth = () => {
    const { setPageZoom, pageWidth } = this.props;
    const newPageZoom = this.refs.spacer.offsetWidth / pageWidth;
    setPageZoom(newPageZoom);
  }

  handleClickOriginalSize = () => {
    const { setPageZoom } = this.props;
    setPageZoom(1);
  }

  renderDocuments() {
    const { questions, documents, pageZoom, pageWidth } = this.props;
    return documents.map((document, index) => {
      return (
        <div className={styles.page} key={index}>
          <img src={document} alt={`Page Image ${index + 1}`} 
            className={styles.pageImage} ref={`pageImage${index + 1}`} />
        </div>
      );
    })
  }

  renderToolBox() {
    return (
      <div className={styles.toolBox}>
        <div className={styles.toolButton}>
          <Button><MdZoomIn size={24} onClick={this.handleClickZoomIn} /></Button>
        </div>
        <div className={styles.toolButton}>
          <Button><MdZoomOut size={24} onClick={this.handleClickZoomOut} /></Button>
        </div>
        <div className={styles.toolButton}>
          <Button><MdSettingsOverscan size={24} onClick={this.handleClickFitWidth} /></Button>
        </div>
        <div className={styles.toolButton}>
          <Button><MdZoomOutMap size={24} onClick={this.handleClickOriginalSize}/></Button>
        </div>
      </div>
    )
  }

  render() {
    const { activeInputName, documentMapping, questions, currentQuestionId,
      pageZoom, pageWidth } = this.props;
    const { isDrawing, startX, startY, endX, endY } = this.state;
    var boardOptionals = {};
    const zoomedWidth = pageWidth * pageZoom;
    const pageStyle = {width: zoomedWidth};
    boardOptionals['style'] = pageStyle;
    if (activeInputName) {
      boardOptionals['style'] = _.merge(boardOptionals['style'], {
        cursor: 'crosshair'
      });
    }
    var documentMappingComponents = () => {
      return documentMapping.map((mappingInfo) => {
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
            onDragStart={this.handleDragStart}
            onDragStop={this.handleDragStop}
            onResizeStop={this.handleResizeStop}
            onClick={this.handleElementClick}
            key={`${mappingInfo.id}-${0}`}
            minWidth={5}
            minHeight={5}
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
      <div className={styles.pageView}>
        <div className={styles.clientArea}>
          <div className={styles.spacer} ref="spacer"></div>
          <div className={styles.pagesWrapper} ref="pagesWrapper" style={pageStyle}>
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
        </div>
        {this.renderToolBox()}
      </div>
    )
  }
}

export default PageView;
