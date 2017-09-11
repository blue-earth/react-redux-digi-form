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
        selectedItems,
        actionsMenu,
        idName
      },
      rowData
    } = this.props;
    const inlineActions = _.filter(actionsMenu, function (o) { return o.isInlineAction; });
    return (
      <div ref="root" className={styles.selectionCell}>
        {
          inlineActions.map((item, index) => (
            <ActionButton key={index}
              id={rowData[idName]}
              index={index}
              action={item}
              formStatus={rowData['status']} />
          ))
        }
        <DropdownSelection
          id={rowData[idName]}
          formStatus={rowData['status']}
          selectedItems={selectedItems}
          onSelect={this.handleSelectItem}
          actionsMenu={actionsMenu}
          checked={_.includes(selectedItems, rowData.id)} />
      </div>
    );
  }
}
