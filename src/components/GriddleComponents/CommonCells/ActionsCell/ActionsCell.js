import React, {
  Component,
  PropTypes
} from 'react';
import ActionButton from './ActionButton';
import ActionsDropdown from '../ActionsDropdown';
import _ from 'lodash';
import styles from './ActionsCell.scss';

export default class ActionsCell extends Component {

  static propTypes = {
    metadata: PropTypes.object,
    rowData: PropTypes.object
  }

  handleSelectItem = () => {
    const { metadata: { toggleSelectItem, idColumnName }, rowData } = this.props;
    toggleSelectItem(rowData[idColumnName]);
  }

  render() {
    const {
      metadata: {
        selectedItems,
        actionsMenu,
        idColumnName
      },
      rowData
    } = this.props;
    const inlineActions = _.filter(actionsMenu, function (o) { return o.isInlineAction; });
    return (
      <div ref="root" className={styles.selectionCell}>
        {
          inlineActions.map((item, index) => (
            <ActionButton key={index}
              id={rowData[idColumnName]}
              rowData={rowData}
              index={index}
              action={item} />
          ))
        }
        <ActionsDropdown
          id={rowData[idColumnName]}
          rowData={rowData}
          selectedItems={selectedItems}
          onSelect={this.handleSelectItem}
          actionsMenu={actionsMenu}
          checked={_.includes(selectedItems, rowData[idColumnName])} />
      </div>
    );
  }
}
