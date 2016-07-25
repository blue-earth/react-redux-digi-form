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
        <Dropdown pullRight onSelect={this.selectFilter} className={styles.dropdownHeader}>
          <span className={styles.dropdownText}>{this.props.displayName}</span>
          <a href="javascript:;" bsRole="toggle"
            className={styles.dropdownArrow}
            onClick={this.stopPropagation}>
            <MdKeyboardArrowDown size={16} />
          </a>
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
