import React, {
  Component,
  PropTypes
} from 'react';

import {
  Dropdown,
  MenuItem,
  Checkbox,
  Popover,
  OverlayTrigger
} from 'react-bootstrap';
import { Link } from 'react-router';
import { submissionsUrl } from 'helpers/urlHelper';
import {
  MdKeyboardArrowDown,
  MdEmail,
  MdPhone
} from 'react-icons/lib/md';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './CustomCells.scss';

export class DropdownHeaderCellBase extends Component {

  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired
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
    return [
      { key: 'todo', text: 'Add menu item' }
    ];
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

export class AuthorHeaderCell extends DropdownHeaderCellBase {

  get menuItems() {
    return [
      { key: '0-9', text: '0 - 9' },
      { key: 'A-H', text: 'A - H' },
      { key: 'I-P', text: 'I - P' },
      { key: 'Q-Z', text: 'Q - Z' },
      { key: 'other', text: 'Other' }
    ];
  }

}

export class ProgressHeaderCell extends DropdownHeaderCellBase {

  get menuItems() {
    return [
      { key: 'new', text: 'New' },
      { key: 'processing', text: 'Processing' },
      { key: 'rejected', text: 'Rejected' },
      { key: 'done', text: 'Done' }
    ];
  }

}

export class StatusHeaderCell extends DropdownHeaderCellBase {

  get menuItems() {
    return [
      { key: 'abandoned', text: 'Abandoned' },
      { key: 'incomplete', text: 'Incomplete' },
      { key: 'completed', text: 'Completed' }
    ];
  }

}

export class ContactInfoCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired
  };

  get emailPopover() {
    const { rowData } = this.props;
    return (
      <Popover id={`emailPopOver_${rowData.response_id}`}>
        <div className="text-center">
          <MdEmail size={18} />
          <br />
          {rowData.contact_email}
        </div>
        <CopyToClipboard text={rowData.contact_email}>
          <a href="javascript:;">Copy to clipboard</a>
        </CopyToClipboard>
      </Popover>
    );
  }

  get phonePopover() {
    const { rowData } = this.props;
    return (
      <Popover id={`phonePopOver_${rowData.response_id}`}>
        <div className="text-center">
          <MdPhone size={18} />
          <br />
          {rowData.contact_phone}
        </div>
        <CopyToClipboard text={rowData.contact_phone}>
          <a href="javascript:;">Copy to clipboard</a>
        </CopyToClipboard>
      </Popover>
    );
  }

  render() {
    return (
      <div className="text-center">
        <OverlayTrigger trigger="focus" placement="bottom" overlay={this.emailPopover}>
          <span tabIndex={0} className={styles.contactIcon}>
            <MdEmail size={18} />
          </span>
        </OverlayTrigger>
        <OverlayTrigger trigger="focus" placement="bottom" overlay={this.phonePopover}>
          <span tabIndex={0} className={styles.contactIcon}>
            <MdPhone size={18} />
          </span>
        </OverlayTrigger>
      </div>
    );
  }
}

export class ActionsCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired
  };

  render() {
    const { rowData } = this.props;
    return (
      <Link to={submissionsUrl(`/${rowData.form_id}/${rowData.response_id}`)}>
        View
      </Link>
    );
  }
}
