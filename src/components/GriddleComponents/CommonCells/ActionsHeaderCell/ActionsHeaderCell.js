import React, {
  Component,
  PropTypes
} from 'react';
import ActionsDropdown from '../ActionsDropdown';
import styles from './ActionsHeaderCell.scss';

class ActionsHeaderCell extends Component {

  static propTypes = {
    selectedItems: PropTypes.array,
    selectAllItems: PropTypes.func,
    isAllSelected: PropTypes.bool,
    actionsMenu: PropTypes.array
  }

  handleSelectItem = () => {
    const { selectAllItems, isAllSelected } = this.props;
    selectAllItems(!isAllSelected);
  }

  render() {
    const { isAllSelected, actionsMenu, selectedItems } = this.props;
    return (
      <div className={styles.selectionCell}>
        <ActionsDropdown
          selectedItems={selectedItems}
          checked={isAllSelected}
          onSelect={this.handleSelectItem}
          actionsMenu={actionsMenu} />
      </div>
    );
  }
}

export default ActionsHeaderCell;
