import React, {
  Component,
  PropTypes
} from 'react';
import DropdownSelection from '../DropdownSelection';
import styles from './SelectionHeaderCell.scss';

class SelectionHeaderCell extends Component {

  static propTypes = {
    selectedItems: PropTypes.array,
    selectAllItems: PropTypes.func,
    isAllSelected: PropTypes.bool,
    dropdownMenus: PropTypes.array
  }

  handleSelectItem = () => {
    const { selectAllItems, isAllSelected } = this.props;
    selectAllItems(!isAllSelected);
  }

  render() {
    const { isAllSelected, dropdownMenus, selectedItems } = this.props;
    return (
      <div className={styles.selectionCell}>
        <DropdownSelection
          selectedItems={selectedItems}
          checked={isAllSelected}
          onSelect={this.handleSelectItem}
          dropdownMenus={dropdownMenus} />
      </div>
    );
  }
}

export default SelectionHeaderCell;
