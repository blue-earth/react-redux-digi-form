import React, {
  Component,
  PropTypes
} from 'react';
import SelectButton from 'components/Buttons/SelectButton';
import { ButtonToolbar } from 'react-bootstrap';
import Icon from 'components/Icon';
import styles from './SubmissionsFilter.scss';

class SubmissionsFilter extends Component {

  static propTypes = {
    refresh: PropTypes.func,
    pageSize: PropTypes.number,
    setPageSize: PropTypes.func,
    selectedItems: PropTypes.array
  }

  handleRefresh = () => {
    this.props.refresh();
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

  render() {
    const { pageSize, setPageSize } = this.props;
    return (
      <div className={styles.filterContainer}>
        <ButtonToolbar className="pull-left">
          <SelectButton
            className={styles.formButton}
            label={
              <strong>
                <Icon name="Refresh" height={37} width={15} className={styles.buttonIcon} />
                {' '}
                Refresh
              </strong>}
            isStaticValue
            onClick={this.handleRefresh} />
          <SelectButton className={styles.formButton}
            optionsList={this.paginationOptions}
            label="Show"
            value={pageSize}
            onChange={setPageSize} />
        </ButtonToolbar>
        <ButtonToolbar className="pull-right">
        </ButtonToolbar>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default SubmissionsFilter;
