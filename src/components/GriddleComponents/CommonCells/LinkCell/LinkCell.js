import React, {
  Component,
  PropTypes
} from 'react';
import styles from './LinkCell.scss';

class LinkCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };
  handleClick = () => {
    const { metadata: { goTo, url, idName }, rowData } = this.props;
    goTo(url(rowData[idName]));
  }
  render() {
    const { data } = this.props;
    return (
      <div className={styles.linkCell} onClick={this.handleClick}>{data}</div>
    );
  }
}

export default LinkCell;
