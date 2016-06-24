import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import styles from './PageView.scss';
import { findIndexById } from 'helpers/pureFunctions';
import ResizableAndMovablePlus from 'components/ResizableAndMovablePlus';
import { Button } from 'react-bootstrap';
import { MdZoomIn, MdZoomOut, MdSettingsOverscan, MdZoomOutMap } from 'react-icons/lib/md';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
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

  };

  componentWillMount() {

  }

  componentDidMount() {
    // if (this.refs.pageImage1) {
    //   var pageImage1 = this.refs.pageImage1;
    //   console.log(pageImage1.naturalWidth);
    // }
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
    const { setPageZoom, documents } = this.props;
    const maxPageWidth = _.maxBy(documents, function(o) { return o.width; }).width;
    const newPageZoom = this.refs.spacer.offsetWidth / maxPageWidth;
    setPageZoom(newPageZoom);
  }

  handleClickOriginalSize = () => {
    const { setPageZoom } = this.props;
    setPageZoom(1);
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
          <DrawingBoard {...this.props} pageNumber={index + 1} containerId="clientArea" />
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
      pageZoom, documents } = this.props;
    const { isDrawing, startX, startY, endX, endY } = this.state;
    var boardOptionals = {};
    const maxPageWidth = _.maxBy(documents, function(o) { return o.width; }).width;
    const zoomedWidth = maxPageWidth * pageZoom;
    const pageStyle = {width: zoomedWidth};

    return (
      <div className={styles.pageView}>
        <div className={styles.clientArea} data-id="clientArea">
          <div className={styles.clientAreaInner}>
            <div className={styles.spacer} ref="spacer"></div>
            <div className={styles.pagesWrapper} ref="pagesWrapper" style={pageStyle}>
              {this.renderDocuments()}
            </div>
          </div>
        </div>
        {this.renderToolBox()}
      </div>
    )
  }
}

export default PageView;
