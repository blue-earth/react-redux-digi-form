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
        <DropdownSelection
          selectedItems={selectedItems}
          checked={isAllSelected}
          onSelect={this.handleSelectItem}
          actionsMenu={actionsMenu} />
      </div>
    );
  }
}

export default SelectionHeaderCell;
