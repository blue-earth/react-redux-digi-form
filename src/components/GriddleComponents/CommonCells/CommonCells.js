import React, {
  Component,
  PropTypes
} from 'react';

import {
  Dropdown,
  MenuItem,
  Checkbox,
  OverlayTrigger,
  Tooltip,
  Popover
} from 'react-bootstrap';
import {
  FaCaretDown
} from 'react-icons/lib/fa';
import _ from 'lodash';
import moment from 'moment';
import styles from './CommonCells.scss';
import classNames from 'classnames';

import Icon from 'components/Icon';

class CustomToggle extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func
  };

  handleClick = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    this.props.onClick(e);
  }

  render() {
    const { children, className } = this.props;
    return (
      <a href="#" className={className} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}

export class LinkCell extends Component {

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

class ActionButton extends Component {

  static propTypes = {
    id: PropTypes.number,
    index: PropTypes.number,
    action: PropTypes.object
  }

  handleClick = () => {
    const { action, id } = this.props;
    action.onClick(id);
  }
  render() {
    const { action, index } = this.props;
    const tooltip = (
      <Tooltip className="actionTooltip" id={`actionTooltip-${index}-${action.name}`} placement="bottom">
        {action.label}
      </Tooltip>
    );
    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={tooltip}>
        <div className={styles.actionIconWrapper} onClick={this.handleClick}>
          {action.icon}
        </div>
      </OverlayTrigger>
    );
  }
}

class DropdownMenu extends Component {
  static propTypes = {
    menu: PropTypes.object,
    id: PropTypes.number
  }

  handleClick = () => {
    const { menu, id } = this.props;
    menu.onClick(id);
  }

  render() {
    const { menu } = this.props;
    return (
      <li className={styles.dropdownMenu} onClick={this.handleClick}>
        <div className={styles.actionIconWrapper}>
          <Icon name={menu.icon} height={16} style={{verticalAlign: 'top'}} />
        </div>
        {menu.label}
      </li>
    );
  }
}

class SelectionSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      isMenuOpen: false
    };
  }

  static propTypes = {
    id: PropTypes.number,
    checked: PropTypes.bool,
    dropdownMenus: PropTypes.array,
    onSelect: PropTypes.func,
    onCheckboxSelect: PropTypes.func
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
    const { onCheckboxSelect } = this.props;
    onCheckboxSelect();
    this.setState({
      hover: true
    });
  }

  render() {
    const { checked, dropdownMenus, id } = this.props;
    const dropdown = (
      <Popover arrowOffsetLeft={124} className="dropdownMenuContent" id="dropdownmenu" placement="bottom">
        <ul className={styles.dropdownMenus}>
          {dropdownMenus.map((menu, index) => <DropdownMenu key={index} menu={menu} id={id} />)}
        </ul>
      </Popover>);
    return (
      <OverlayTrigger
        rootClose
        trigger="click"
        placement="bottom"
        overlay={dropdown}
        onEnter={this.handleMenuOpen}
        onExit={this.handleMenuClose}>
        <div className={classNames(styles.checkBoxWrapper, {[styles.hover]: this.state.hover})}
          onClick={this.handleClick}
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

export class SelectionCell extends Component {

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
      <div className={styles.selectionCell}>
        {
          inlineActions.map((item, index) => (
            <ActionButton key={index} id={rowData[idName]} index={index} action={item} />
          ))
        }
        <SelectionSection
          id={rowData[idName]}
          onCheckboxSelect={this.handleSelectItem}
          dropdownMenus={dropdownMenus}
          checked={_.includes(selectedItems, rowData.id)} />
      </div>
    );
  }
}

export class SelectionHeaderCell extends Component {

  static propTypes = {
    selectAllItems: PropTypes.func,
    isAllSelected: PropTypes.bool,
    dropdownMenus: PropTypes.array
  }

  handleSelectItem = () => {
    const { selectAllItems, isAllSelected } = this.props;
    selectAllItems(!isAllSelected);
  }

  render() {
    const { isAllSelected, dropdownMenus } = this.props;
    return (
      <div className={styles.selectionCell}>
        <SelectionSection
          checked={isAllSelected}
          onCheckboxSelect={this.handleSelectItem}
          dropdownMenus={dropdownMenus} />
      </div>
    );
  }
}

export class DropdownHeaderCell extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired,
    menuItems: PropTypes.array
  };

  static defaultProps = {
    menuItems: [
      { key: 'todo', text: 'Add menu item' }
    ]
  };

  static counter = 0;

  constructor(props) {
    super(props);
    DropdownHeaderCell.counter++;
  }

  selectFilter = (key) => {
    // this.props.filterByColumn(key, this.props.columnName)
  }

  // Override this member function for custom event handler.
  handleCheckboxChange = (event) => {
    console.log(event.target);
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  }

  // Override this property to add menu item.
  get menuItems() {
    return this.props.menuItems;
  }

  render() {
    return (
      <div>
        <Dropdown pullRight
          id={`dropdownHeaderCell_${DropdownHeaderCell.counter}`}
          onSelect={this.selectFilter}
          className={styles.dropdownHeader}>
          <span className={styles.dropdownText}>{this.props.displayName}</span>
          <CustomToggle bsRole="toggle"
            className={styles.dropdownArrow}
          >
            <FaCaretDown size={16} />
          </CustomToggle>
          <Dropdown.Menu onClick={this.stopPropagation}>
            {
              this.menuItems.map(item => {
                return (
                  <MenuItem eventKey={item.key} key={item.key}>
                    <Checkbox inline onChange={this.handleCheckboxChange} value={item.key}>
                      {item.text}
                    </Checkbox>
                  </MenuItem>
                );
              })
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export class DateCell extends Component {

  static propTypes = {
    data: PropTypes.string.isRequired
  };

  get formattedDate() {
    const { data } = this.props;
    const dateValue = moment(data);
    const dateDiff = moment().diff(dateValue);
    const aDay = 24 * 3600 * 1000;
    if (dateDiff < aDay) {
      return 'Today';
    } else if (dateDiff < 2 * aDay) {
      return 'Yesterday';
    } else {
      return dateValue.format('DD/MM/YY');
    }
  }

  render() {
    return (
      <span>{this.formattedDate}</span>
    );
  }
}
