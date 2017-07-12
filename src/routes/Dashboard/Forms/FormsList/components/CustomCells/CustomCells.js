import React, {
  Component,
  PropTypes
} from 'react';

import { Link } from 'react-router';
import { formsUrl } from 'helpers/urlHelper';
import {
  Checkbox
} from 'react-bootstrap';
import {
  FaEdit,
  FaPaperPlaneO
} from 'react-icons/lib/fa';
import _ from 'lodash';
import styles from './CustomCells.scss';
import { DateCell } from 'components/GriddleComponents/CommonCells/CommonCells';

export { DateCell };

export class SelectionHeaderCell extends Component {
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
      <div className={styles.selectionHeaderCell}>
        <div className={styles.rightMiddle}>
          <Checkbox onChange={this.handleCheckboxChange} checked={isAllSelected}>
            &nbsp;
          </Checkbox>
        </div>
      </div>
    );
  }
}
export class ActionsCell extends Component {
  static propTypes = {
    rowData: PropTypes.object.isRequired
  };
  render() {
    const {rowData} = this.props;
    return (
      <ul className={styles.actionsWrapper}>
        <li>
          <Link to={formsUrl(`/${rowData.id}/edit`)}>
            <FaEdit size={16} />
            <span className={styles.actionText}>Edit</span>
          </Link>
        </li>
        <li>
          <Link to={formsUrl(`/${rowData.id}/edit`)}>
            <FaPaperPlaneO size={16} />
            <span className={styles.actionText}>Send</span>
          </Link>
        </li>
      </ul>
    );
  }
}

export class SelectionCell extends Component {

  static propTypes = {
    rowData: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired
  };

  handleCheckboxChange = (event) => {
    const { metadata: { toggleSelectItem }, rowData } = this.props;
    toggleSelectItem(rowData.id);
  }

  render() {
    const { rowData, metadata: { selectedItems } } = this.props;
    return (
      <div className={styles.selectionCell}>
        <div className={styles.rightMiddle}>
          <Checkbox onChange={this.handleCheckboxChange}
            checked={_.includes(selectedItems, rowData.id)}>
            &nbsp;
          </Checkbox>
        </div>
      </div>
    );
  }
}
