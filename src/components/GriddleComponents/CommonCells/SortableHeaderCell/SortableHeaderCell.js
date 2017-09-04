import React, {
  Component,
  PropTypes
} from 'react';
import styles from './SortableHeaderCell.scss';
class SortableHeaderCell extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className={styles.sortableHeader}>{this.props.displayName}</div>
    );
  }
}

export default SortableHeaderCell;
