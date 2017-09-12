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
import styles from './DropdownSelection.scss';

const cx = classNames.bind(styles);

export default class DropdownSelection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      isMenuOpen: false
    };
  }

  static propTypes = {
    id: PropTypes.number,
    formStatus: PropTypes.string,
    subdomain: PropTypes.string,
    slug: PropTypes.string,
    selectedItems: PropTypes.array,
    checked: PropTypes.bool,
    actionsMenu: PropTypes.array,
    onSelect: PropTypes.func
  }

  onMouseOver = () => {
    this.setState({
      hover: true
    });
  }

  onMouseOut = () => {
    if (!this.state.isMenuOpen) {
      this.setState({
        hover: false
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
      hover: false
    });
  }

  handleCheckboxChange = () => {
    const { onSelect } = this.props;
    onSelect();
    this.setState({
      hover: true
    });
  }

  handleMenuClick = (event) => {
    const { actionsMenu, id, subdomain, slug, selectedItems } = this.props;
    const actionItem = actionsMenu[event.currentTarget.dataset.index];
    if (selectedItems && selectedItems.length > 0) {
      if (selectedItems.length > 1 && actionItem.allowMultiple) {
        actionItem.onClick(selectedItems);
      }
      if (selectedItems.length === 1) {
        actionItem.onClick(selectedItems[0], subdomain, slug);
      }
    } else {
      actionItem.onClick(id, subdomain, slug);
    }
    this.refs.dropdownTrigger.hide();
  }

  render() {
    const { checked, actionsMenu, id, formStatus, selectedItems } = this.props;
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
            if (formStatus && actionItem.hiddenWithStatus.indexOf(formStatus) > -1) {
              isItemHidden = true;
            }
            var isItemDisabled = false;
            if (isHeaderCell && noneSelected) {
              isItemDisabled = true;
            }
            if (formStatus && actionItem.disabledWithStatus.indexOf(formStatus) > -1) {
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
        <div className={cx(styles.checkBoxWrapper, {[styles.hover]: this.state.hover})}
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
