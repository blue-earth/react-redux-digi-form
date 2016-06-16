import React, { Component, PropTypes } from 'react';
import BuilderHeader from 'components/Headers/BuilderHeader';
import styles from './PageView.scss'
import ResizableAndMovable from 'react-resizable-and-movable';

class PageView extends Component {
  static propTypes = {
    /*
     * documents: Redux state to hold document image urls.
     */
    documents: PropTypes.array.isRequired,
  };

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentDidMount() {

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
    const { activeInputName } = this.props;
    var boardOptionals = {};
    if (activeInputName) {
      boardOptionals['style'] = {
        cursor: 'crosshair'
      }
    }
    return (
      <div className={styles.pageView}>
        {this.renderDocuments()}
        <div className={styles.board} {...boardOptionals}>
          <ResizableAndMovable
            className={styles.element}
            x={20}
            y={20}
            width={200}
            height={200}
          >  
            <p>Example</p>
          </ResizableAndMovable>
        </div>
      </div>
    )
  }
}

export default PageView;
