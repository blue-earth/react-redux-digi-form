import React, {
  Component,
  PropTypes
} from 'react';
import ActionButton from './ActionButton';
import DropdownSelection from '../DropdownSelection';
import _ from 'lodash';

import styles from './SelectionCell.scss';

export default class SelectionCell extends Component {

  static propTypes = {
    metadata: PropTypes.object,
    rowData: PropTypes.object
  }

  handleSelectItem = () => {
    const { metadata: { toggleSelectItem, idName }, rowData } = this.props;
    toggleSelectItem(rowData[idName]);
  }

  render() {
    const {
      metadata: {
        inlineActions,
        selectedItems,
        dropdownMenus,
        idName
      },
      rowData
    } = this.props;
    return (
      <div ref="root" className={styles.selectionCell}>
        {
          inlineActions.map((item, index) => (
            <ActionButton key={index} id={rowData[idName]} index={index} action={item} />
          ))
        }
        <DropdownSelection
          id={rowData[idName]}
          onSelect={this.handleSelectItem}
          dropdownMenus={dropdownMenus}
          checked={_.includes(selectedItems, rowData.id)} />
      </div>
    );
  }
}
