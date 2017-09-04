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
import SubmissionStatus from '../SubmissionStatus';
import _ from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import styles from './CustomCells.scss';

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

export class StatusCell extends Component {
  static propTypes = {
    data: PropTypes.string
  };
  render() {
    const {data} = this.props;
    return (<SubmissionStatus status={data} />);
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
