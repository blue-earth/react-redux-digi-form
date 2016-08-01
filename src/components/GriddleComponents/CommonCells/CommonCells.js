import React, {
  Component,
  PropTypes
} from 'react';

import {
  Dropdown,
  MenuItem,
  Checkbox
} from 'react-bootstrap';
import {
  MdKeyboardArrowDown
} from 'react-icons/lib/md';
import moment from 'moment';
import styles from './CommonCells.scss';

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
      <a href="" className={className} onClick={this.handleClick}>
        {children}
      </a>
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
            <MdKeyboardArrowDown size={16} />
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
