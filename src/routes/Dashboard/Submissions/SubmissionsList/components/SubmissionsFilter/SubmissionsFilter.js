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
    setPageSize: PropTypes.func
  }
  get typeOptions() {
    return [
      {
        key: 'form',
        eventKey: 'form',
        label: 'Form'
      },
      {
        key: 'other',
        eventKey: 'something',
        label: 'Other type'
      },
      {
        key: 'someOther',
        eventKey: 'something',
        label: 'Some other type'
      }
    ];
  }

  get userOptions() {
    return [
      {
        key: 'sales',
        eventKey: 'sales',
        label: 'Sales Team'
      },
      {
        key: 'other',
        eventKey: 'other',
        label: 'Another user'
      }
    ];
  }

  get timeOptions() {
    return [
      {
        key: 'thisweek',
        eventKey: 'thisweek',
        label: 'This Week'
      },
      {
        key: 'otherweek',
        eventKey: 'otherweek',
        label: 'Some Other Week'
      }
    ];
  }

  get paginationOptions() {
    return [
      {
        key: '5',
        label: '5'
      },
      {
        key: '10',
        label: '10'
      },
      {
        key: '20',
        label: '20'
      }
    ];
  }
  get actionOptions() {
    return [
      {
        key: 'edit',
        label: 'Edit'
      },
      {
        key: 'delete',
        label: 'Delete'
      },
      {
        key: 'other action',
        label: 'Other actions'
      }
    ];
  }
  render() {
    const { pageSize, setPageSize } = this.props;
    return (
      <div className={styles.filterContainer}>
        <ButtonToolbar className="pull-left">
          <Button style="formButton">
            <IoRefresh size={18} />
            {' '}
            Refresh
          </Button>
          <Button style="formButton">
            <IoStatsBars size={18} />
            {' '}
            Customize
          </Button>
        </ButtonToolbar>
        <ButtonToolbar className="pull-right">
          <SelectButton className={styles.formButton} optionList={this.typeOptions} label="Type" value="Form" />
          <SelectButton className={styles.formButton} optionList={this.userOptions} label="User" value="Sales Team" />
          <SelectButton className={styles.formButton} optionList={this.timeOptions} value="This Week" />
          <SelectButton className={styles.formButton} optionList={this.paginationOptions} label="Show"
            value={pageSize} onChange={setPageSize} />
          <SelectButton className={styles.formButton} optionList={this.actionOptions} value="Actions" staticValue />
        </ButtonToolbar>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default SubmissionsFilter;
