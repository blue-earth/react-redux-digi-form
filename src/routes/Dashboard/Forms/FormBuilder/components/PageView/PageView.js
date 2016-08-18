import React, {
  Component,
  PropTypes
} from 'react';
import styles from './PageView.scss';
import {
  Button
} from 'react-bootstrap';
import DrawingBoard from '../DrawingBoard/DrawingBoard';
import _ from 'lodash';
import { pageZoomPercent } from 'helpers/formBuilderHelper';

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
     * activeInputName: Redux state to indicate the active input element name.
     */
    activeInputName: PropTypes.string.isRequired,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.array.isRequired,

    /*
     * setMappingInfo: Action to update the document mapping info.
     */
    setMappingInfo: PropTypes.func.isRequired,

    /*
     * setMappingPositionInfo: Action to update the document mapping position info of active selection.
     */
    setMappingPositionInfo: PropTypes.func.isRequired,

    /*
     * pageZoom: Redux state to keep the page zoom ratio.
     */
    pageZoom: PropTypes.number.isRequired,

    /*
     * setPageZoom: Redux action to set page zoom ratio.
     */
    setPageZoom: PropTypes.func.isRequired,

    /*
     * questionEditMode: Redux state to indicate question edit mode
     */
    questionEditMode: PropTypes.bool.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * currentElement: Redux state to hold the element currently being edited.
     */
    currentElement: PropTypes.object
  };

  componentWillMount() {

  }

  componentDidMount() {
  }

  handleElementClick = (metaData) => {
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
    const { setPageZoom } = this.props;
    const maxPageWidth = this.getMaxPageWidth();
    const newPageZoom = this.refs.spacer.offsetWidth / maxPageWidth;
    setPageZoom(newPageZoom);
  }

  handleClickOriginalSize = () => {
    const { setPageZoom } = this.props;
    setPageZoom(1);
  }

  getPageDOM = (pageNumber) => {
    return this.refs[`page_${pageNumber}`];
  }

  getMaxPageWidth = () => {
    const { documents = [] } = this.props;
    return documents.length > 0 ? _.maxBy(documents, o => o.width).width : 100;
  }

  renderDocuments() {
    const { documents, pageZoom } = this.props;
    return documents
      ? documents.map((document, index) => {
        const zoomedWidth = document.width * pageZoom;
        const pageStyle = {width: zoomedWidth};
        const pageNumber = index + 1;
        return (
          <div className={styles.page} key={index}
            ref={`page_${pageNumber}`}
            style={pageStyle}>
            <img src={document.url} alt={`Page Image ${pageNumber}`}
              className={styles.pageImage} ref={`pageImage${pageNumber}`} />
            <DrawingBoard {...this.props} pageNumber={pageNumber}
              getPageDOM={this.getPageDOM} containerId="clientArea" />
          </div>
        );
      })
      : false;
  }

  renderToolBox() {
    const { pageZoom } = this.props;
    return (
      <div className={styles.toolBox}>
        <Button onClick={this.handleClickZoomOut} className={styles.zoomButton}>-</Button>
        <div className={styles.zoomPercent}>{pageZoomPercent(pageZoom)}</div>
        <Button onClick={this.handleClickZoomIn} className={styles.zoomButton}>+</Button>
      </div>
    );
  }

  render() {
    const { pageZoom } = this.props;
    const maxPageWidth = this.getMaxPageWidth();
    const zoomedWidth = maxPageWidth * pageZoom;
    const pageStyle = { width: zoomedWidth };

    return (
      <div className={styles.pageView}>
        {this.renderToolBox()}
        <div className={styles.clientArea} data-id="clientArea">
          <div className={styles.spacer} ref="spacer"></div>
          <div className={styles.clientAreaInner}>
            <div className={styles.pagesWrapper} ref="pagesWrapper" style={pageStyle}>
              {this.renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageView;
