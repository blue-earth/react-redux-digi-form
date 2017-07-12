import React, {
  Component,
  PropTypes
} from 'react';

import {
  Popover,
  OverlayTrigger,
  Checkbox
} from 'react-bootstrap';
import {
  MdEmail,
  MdPhone
} from 'react-icons/lib/md';
import { FaCircleO } from 'react-icons/lib/fa';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './CustomCells.scss';
import { DropdownHeaderCell, DateCell } from 'components/GriddleComponents/CommonCells/CommonCells';
import classNames from 'classnames';

export { DateCell };

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
      { key: 'unopen', text: 'Unopen' },
      { key: 'opened', text: 'Opened' },
      { key: 'saved', text: 'Saved' },
      { key: 'submitted', text: 'Submitted' },
      { key: 'autosave', text: 'Auto Save' }
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

export class statusCell extends Component {
  static propTypes = {
    data: PropTypes.string
  };
  render() {
    const {data} = this.props;
    const classList = ['new', 'rejected', 'processing', 'done'];
    const statusClass = data.toLowerCase().replace(/ /g, '');
    return (
      <div>
        <div className={classNames(
          styles.statusRing,
          styles[statusClass],
          {hide: classList.indexOf(statusClass) === -1}
        )}>
          <FaCircleO style={{verticalAlign: 'baseline'}} />
        </div>
        {' '}
        {data}
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
    const contactEmail = rowData.contact_email ? rowData.contact_email : '';
    return (
      <Popover id={`emailPopOver_${rowData.response_id}`}>
        <div className="text-center">
          <MdEmail size={18} />
          <br />
          {contactEmail}
        </div>
        <CopyToClipboard text={contactEmail}>
          <a href="javascript:;">Copy to clipboard</a>
        </CopyToClipboard>
      </Popover>
    );
  }

  get phonePopover() {
    const { rowData } = this.props;
    const contactPhone = rowData.contact_phone ? rowData.contact_phone : '';
    return (
      <Popover id={`phonePopOver_${rowData.response_id}`}>
        <div className="text-center">
          <MdPhone size={18} />
          <br />
          {contactPhone}
        </div>
        <CopyToClipboard text={contactPhone}>
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
