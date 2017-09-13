import React, {
  Component,
  PropTypes
} from 'react';
import styles from './PageView.scss';
import {
  Button
} from 'react-bootstrap';
import DrawingBoard from '../DrawingBoard';
import _ from 'lodash';
import { pageZoomPercent } from 'helpers/formBuilderHelper';

class PageView extends Component {
  static propTypes = {
    /*
     * documents: Redux state to hold document image urls.
     */
    documents: PropTypes.array.isRequired,

    questions: PropTypes.array,

    isModified: PropTypes.bool,

    saveElement: PropTypes.func,

    show: PropTypes.func,

    /*
     * documentMapping: Redux state to hold the bounding box of the question item in document
     */
    documentMapping: PropTypes.object.isRequired,

    /*
     * setMappingPositionInfo: Action to update the document mapping position info of active selection.
     */
    setMappingPositionInfo: PropTypes.func.isRequired,
    deleteMappingInfoByPath: PropTypes.func.isRequired,

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
    questionEditMode: PropTypes.number.isRequired,

    /*
     * setQuestionEditMode: Redux action to set question edit mode
     */
    setQuestionEditMode: PropTypes.func.isRequired,

    /*
     * setCurrentElement: Redux action to set/load currentElement
     */
    setCurrentElement: PropTypes.func.isRequired,

    /*
     * setActiveBox: Redux action to set activeBoxPath path.
     */
    setActiveBox: PropTypes.func.isRequired,

    /*
     * currentElement: Redux state to hold the element currently being edited.
     */
    currentElement: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      viewportWidth: 0,
      viewportHeight: 0
    };
  };

  componentWillMount() {
    window.addEventListener('resize', this.getViewportSize);
  }
  componentDidMount() {
    this.getViewportSize();
    this.props.setPageZoom(this._getMinimiumPageZoomValue());
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.getViewportSize);
  }

  getViewportSize = () => {
    this.setState({
      viewportWidth: this.refs.spacer.offsetWidth,
      viewportHeight: this.refs.pagesWrapper.offsetHeight
    });
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

  _getMinimiumPageZoomValue = () => {
    const maxPageWidth = this.getMaxDocumentWidth();
    return this.refs.spacer.offsetWidth / maxPageWidth;
  }

  getPageDOM = (pageNumber) => {
    return this.refs[`page_${pageNumber}`];
  }

  getMaxDocumentWidth = () => {
    const { documents = [] } = this.props;
    return _.maxBy(documents, o => o.width).width;
  }

  renderDocuments() {
    const { documents, pageZoom } = this.props;
    const { viewportWidth, viewportHeight } = this.state;
    return documents.map((document, index) => {
      const zoomedWidth = document.width * pageZoom;
      const pageStyle = {width: zoomedWidth};
      const pageNumber = index + 1;
      return (
        <div className={styles.page} key={index}
          ref={`page_${pageNumber}`}
          style={pageStyle}>
          <img src={document.url} alt={`Page Image ${pageNumber}`}
            className={styles.pageImage} ref={`pageImage${pageNumber}`} />
          <DrawingBoard
            documents={this.props.documents}
            questions={this.props.questions}
            deleteMappingInfoByPath={this.props.deleteMappingInfoByPath}
            isModified={this.props.isModified}
            saveElement={this.props.saveElement}
            documentMapping={this.props.documentMapping}
            setMappingPositionInfo={this.props.setMappingPositionInfo}
            pageZoom={this.props.pageZoom}
            setPageZoom={this.props.setPageZoom}
            questionEditMode={this.props.questionEditMode}
            setQuestionEditMode={this.props.setQuestionEditMode}
            currentElement={this.props.currentElement}
            setCurrentElement={this.props.setCurrentElement}
            show={this.props.show}
            setActiveBox={this.props.setActiveBox}
            pageNumber={pageNumber}
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
            getPageDOM={this.getPageDOM}
            containerId="clientArea" />
        </div>
      );
    });
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

  _getPageWrapperStyle = () => {
    if (!this.props.documents.length) {
      return {'width': '100%'};
    } else {
      const { pageZoom } = this.props;
      const maxPageWidth = this.getMaxDocumentWidth();
      const zoomedWidth = maxPageWidth * pageZoom;
      return { width: zoomedWidth };
    }
  };

  render() {
    return (
      <div className={styles.pageView}>
        {this.renderToolBox()}
        <div className={styles.clientArea} data-id="clientArea">
          <div className={styles.spacer} ref="spacer"></div>
          <div className={styles.clientAreaInner}>
            <div className={styles.pagesWrapper} ref="pagesWrapper" style={this._getPageWrapperStyle()}>
              {this.renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageView;
