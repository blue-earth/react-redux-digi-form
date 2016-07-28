import React, {
  Component,
  PropTypes
} from 'react';

import {
  Popover,
  OverlayTrigger,
  Checkbox
} from 'react-bootstrap';
import { Link } from 'react-router';
import { submissionsUrl } from 'helpers/urlHelper';
import {
  MdEmail,
  MdPhone
} from 'react-icons/lib/md';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './CustomCells.scss';
import { DropdownHeaderCell, DateCell } from 'components/GriddleComponents/CommonCells/CommonCells';

export { DateCell };

export class AuthorHeaderCell extends DropdownHeaderCell {

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

export class ProgressHeaderCell extends DropdownHeaderCell {

  get menuItems() {
    return [
      { key: 'new', text: 'New' },
      { key: 'processing', text: 'Processing' },
      { key: 'rejected', text: 'Rejected' },
      { key: 'done', text: 'Done' }
    ];
  }

}

export class StatusHeaderCell extends DropdownHeaderCell {

  get menuItems() {
    return [
      { key: 'abandoned', text: 'Abandoned' },
      { key: 'incomplete', text: 'Incomplete' },
      { key: 'completed', text: 'Completed' }
    ];
  }

}

export class ActionsHeaderCell extends Component {
  static propTypes = {
    displayName: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired,
    isAllSelected: PropTypes.bool.isRequired,
    selectAllItems: PropTypes.func.isRequired
  };

  handleCheckboxChange = (event) => {
    const { selectAllItems, isAllSelected } = this.props;
    selectAllItems(!isAllSelected);
  }

  render() {
    const { isAllSelected } = this.props;
    return (
      <div className={styles.actionsHeaderCell}>
        <div className={styles.rightMiddle}>
          <Checkbox onChange={this.handleCheckboxChange} checked={isAllSelected}>
            &nbsp;
          </Checkbox>
        </div>
      </div>
    );
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
    rowData: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired
  };

  handleCheckboxChange = (event) => {
    const { metadata: { toggleSelectItem }, rowData } = this.props;
    toggleSelectItem(rowData.response_id);
  }

  render() {
    const { rowData, metadata: { selectedItems } } = this.props;
    return (
      <div className={styles.actionsCell}>
        <Link to={submissionsUrl(`/${rowData.form_id}/${rowData.response_id}`)}>
          View
        </Link>
        <div className={styles.rightMiddle}>
          <Checkbox onChange={this.handleCheckboxChange}
            checked={_.includes(selectedItems, rowData.response_id)}>
            &nbsp;
          </Checkbox>
        </div>
      </div>
    );
  }
}
