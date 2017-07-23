import React, {
  Component,
  PropTypes
} from 'react';
import Button from 'components/Buttons/DashboardButtons/Button';
import SelectButton from 'components/Buttons/SelectButton';
import { ButtonToolbar } from 'react-bootstrap';
import { IoStatsBars, IoRefresh } from 'react-icons/lib/io';
import styles from './SubmissionsFilter.scss';

class SubmissionsFilter extends Component {

  static propTypes = {
    pageSize: PropTypes.number,
    setPageSize: PropTypes.func,
    formAction: PropTypes.func,
    selectedItems: PropTypes.array
  }

  get timeOptions() {
    return [
      {
        key: 'thisweek',
        label: 'This Week'
      },
      {
        key: 'today',
        label: 'Today'
      }
    ];
  }

  get paginationOptions() {
    return [
      {
        key: 5,
        label: 5
      },
      {
        key: 10,
        label: 10
      },
      {
        key: 20,
        label: 20
      }
    ];
  }
  get actionOptions() {
    const number = this.props.selectedItems.length;
    return [
      {
        key: 'edit',
        label: 'Edit',
        isDisabled: number !== 1
      },
      {
        key: 'delete',
        label: 'Delete',
        isDisabled: number === 0
      }
    ];
  }
  render() {
    const { pageSize, setPageSize, formAction } = this.props;
    const iconStyle = {verticalAlign: 'text-bottom', marginRight: '6px'};
    return (
      <div className={styles.filterContainer}>
        <ButtonToolbar className="pull-left">
          <Button style="formButton">
            <IoRefresh size={18} style={iconStyle} />
            {' '}
            Refresh
          </Button>
          <Button style="formButton">
            <IoStatsBars size={18} style={iconStyle} />
            {' '}
            Customise
          </Button>
        </ButtonToolbar>
        <ButtonToolbar className="pull-right">
          <SelectButton className={styles.formButton} optionsList={this.timeOptions} value="This Week" />
          <SelectButton className={styles.formButton} optionsList={this.paginationOptions} label="Show"
            value={pageSize} onChange={setPageSize} />
          <SelectButton className={styles.formButton} optionsList={this.actionOptions} value="Actions" isStaticValue
            onChange={formAction} />
        </ButtonToolbar>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default SubmissionsFilter;
