import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import {
  FaCaretDown
} from 'react-icons/lib/fa';
import classNames from 'classnames/bind';
import styles from './ActionsDropdown.scss';

const cx = classNames.bind(styles);

export default class ActionsDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
      isMenuOpen: false
    };
  }

  static propTypes = {
    id: PropTypes.number,
    rowData: PropTypes.object,
    selectedItems: PropTypes.array,
    checked: PropTypes.bool,
    actionsMenu: PropTypes.array,
    onSelect: PropTypes.func
  }

  onMouseOver = () => {
    this.setState({
      isHovering: true
    });
  }
  onMouseOut = () => {
    if (!this.state.isMenuOpen) {
      this.setState({
        isHovering: false
      });
    }
  }

  handleMenuOpen = () => {
    this.setState({
      isMenuOpen: true
    });
  }
  handleMenuClose = () => {
    this.setState({
      isMenuOpen: false,
      isHovering: false
    });
  }

  handleCheckboxChange = () => {
    const { onSelect } = this.props;
    onSelect();
    this.setState({
      isHovering: true
    });
  }

  handleMenuClick = (event) => {
    const { actionsMenu, id, rowData, selectedItems } = this.props;
    const actionItem = actionsMenu[event.currentTarget.dataset.index];
    if (selectedItems && selectedItems.length > 0) {
      actionItem.onClick(selectedItems, rowData);
    } else {
      actionItem.onClick([id], rowData);
    }
    this.refs.dropdownTrigger.hide();
  }

  render() {
    const { checked, actionsMenu, id, selectedItems } = this.props;
    var rowStatus = '';
    if (this.props.rowData) {
      rowStatus = this.props.rowData['status'];
    }
    const isHeaderCell = isNaN(id);
    const multipleSelected = selectedItems && selectedItems.length > 1;
    const singleSelected = selectedItems && selectedItems.length === 1;
    const noneSelected = !selectedItems || selectedItems.length < 1;
    const thisRowSelected = (selectedItems && selectedItems.indexOf(id) !== -1) || isHeaderCell;
    const dropdown = (
      <Popover arrowOffsetLeft={124} className="dropdownMenuContent" id={`dropdownmenu-${id}`} placement="bottom">
        <ul className={styles.actionsMenu}>
          {actionsMenu.map((actionItem, index) => {
            var isItemHidden = false;
            if (isHeaderCell && !actionItem.allowMultiple) {
              isItemHidden = true;
            }
            if (rowStatus && actionItem.hiddenWithStatus.indexOf(rowStatus) > -1) {
              isItemHidden = true;
            }
            var isItemDisabled = false;
            if (isHeaderCell && noneSelected) {
              isItemDisabled = true;
            }
            if (rowStatus && actionItem.disabledWithStatus.indexOf(rowStatus) > -1) {
              isItemDisabled = true;
            }
            if (multipleSelected && (!actionItem.allowMultiple || !thisRowSelected)) {
              isItemDisabled = true;
            }
            if (singleSelected && !thisRowSelected) {
              isItemDisabled = true;
            }
            return (!isItemHidden &&
              <li
                key={index}
                data-index={index}
                className={cx(
                  'actionItem',
                  {'disabled': isItemDisabled}
                )}
                onClick={!isItemDisabled && this.handleMenuClick}>
                <div className={styles.actionIconWrapper}>
                  {actionItem.icon}
                </div>
                {actionItem.label}
              </li>
            );
          })}
        </ul>
      </Popover>);
    return (
      <OverlayTrigger
        rootClose
        ref="dropdownTrigger"
        trigger="click"
        placement="bottom"
        overlay={dropdown}
        onEnter={this.handleMenuOpen}
        onExit={this.handleMenuClose}>
        <div className={cx(styles.checkBoxWrapper, {[styles.hover]: this.state.isHovering})}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={this.handleCheckboxChange}
            checked={checked} />
          <FaCaretDown ref="dropdownIcon" size={14} className={styles.dropdownCaret} />
        </div>
      </OverlayTrigger>
    );
  }
}
