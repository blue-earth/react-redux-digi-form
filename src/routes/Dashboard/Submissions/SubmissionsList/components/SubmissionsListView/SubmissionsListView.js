import React, {
  Component,
  PropTypes
} from 'react';
import {
  AuthorHeaderCell,
  // ProgressHeaderCell,
  StatusHeaderCell,
  ActionsHeaderCell,
  // ContactInfoCell,
  DateCell,
  ActionsCell
} from '../CustomCells/CustomCells';
import SubmissionsFilter from '../SubmissionsFilter';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';
import SelectButton from 'components/Buttons/SelectButton';
import EnvironmentSaving from 'components/EnvironmentSaving';
import classNames from 'classnames';
import tableStyles from './tableStyles.scss';
import styles from './SubmissionsListView.scss';

class SubmissionsListView extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested submissions list is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * submissions: Redux state that indicates whether the requested submissions list is being fetched from backend
     */
    submissions: PropTypes.array.isRequired,

    /*
     * fetchSubmissions: Redux action to fetch submissions list from backend with ID specified by request parameters
     */
    fetchSubmissions: PropTypes.func.isRequired,

    /*
     * page: Current page number
     */
    page: PropTypes.number.isRequired,

    /*
     * pageSize: Number of items per page.
     */
    pageSize: PropTypes.number.isRequired,

    /*
     * totalCount: Total number of items from backend.
     */
    totalCount: PropTypes.number.isRequired,

    /*
     * sortColumn: Column ID to sort by.
     */
    sortColumn: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,

    /*
     * sortAscending: true if ascending, false if descending
     */
    sortAscending: PropTypes.bool.isRequired,

    /*
     * selectAllItems: Redux action to select all the rows in table
     */
    selectAllItems: PropTypes.func.isRequired,

    /*
     * toggleSelectItem: Redux action to select or deselect item by id.
     */
    toggleSelectItem: PropTypes.func.isRequired,

    /*
     * selectedItems: Redux state in array to hold selected item ids.
     */
    selectedItems: PropTypes.array.isRequired,
    analyticsPeriod: PropTypes.string.isRequired
  };

  get columnMetadata() {
    const {
      selectAllItems,
      submissions,
      selectedItems,
      toggleSelectItem
    } = this.props;
    return [
      {
        columnName: 'response_id',
        order: 1,
        locked: false,
        visible: true,
        displayName: 'ID',
        cssClassName: styles.columnID
      },
      {
        columnName: 'form_title',
        order: 2,
        locked: false,
        visible: true,
        displayName: 'Name',
        cssClassName: styles.columnName
      },
      {
        columnName: 'status',
        order: 3,
        locked: false,
        visible: true,
        displayName: 'Status',
        customHeaderComponent: StatusHeaderCell,
        cssClassName: styles.columnStatus
      },
      {
        columnName: 'completion_percent',
        order: 4,
        locked: false,
        visible: true,
        displayName: '%',
        cssClassName: styles.columnPercent
      },
      {
        columnName: 'completed_by_name',
        order: 5,
        locked: false,
        visible: true,
        displayName: 'Completed by',
        customHeaderComponent: AuthorHeaderCell,
        cssClassName: styles.columnAuthor
      },
      {
        columnName: 'sent_channel',
        order: 6,
        locked: false,
        visible: true,
        displayName: 'Channel',
        cssClassName: styles.columnChanel
      },
      {
        columnName: 'created',
        order: 7,
        locked: false,
        visible: true,
        displayName: 'Created',
        cssClassName: styles.columnCreated,
        customComponent: DateCell
      },
      {
        columnName: 'actions',
        locked: true,
        sortable: false,
        displayName: '',
        customHeaderComponent: ActionsHeaderCell,
        customComponent: ActionsCell,
        selectedItems,
        toggleSelectItem,
        cssClassName: styles.columnActions,
        customHeaderComponentProps: {
          selectAllItems,
          isAllSelected: submissions.length === selectedItems.length
        }
      }
    ];
  }

  renderSubmissionsList() {
    const {
      isFetching,
      submissions,
      page,
      pageSize,
      sortColumn,
      sortAscending,
      fetchSubmissions,
      totalCount
    } = this.props;
    return (
      <GriddleTable
        results={submissions}
        columnMetadata={this.columnMetadata}
        fetchList={fetchSubmissions}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        sortColumn={sortColumn}
        sortAscending={sortAscending}
        Pagination={Pagination}
        initialSort="response_id"
        isFetching={isFetching}
        showFilter
        useCustomFilterComponent
        customFilterComponent={SubmissionsFilter}
        showSettings
        tableClassName={tableStyles.submissionsTable}
      />
    );
  }

  /* TODO: the SubmissionsFilter component is currently
  in render() because filters aren't rendered in griddle
  unless there is data in the table
  */

  renderActivityPanel() {
    const activities = [{
      name: 'Jordan McCown',
      action: 'completed',
      form: 'SMSF Non Corporate CFD',
      time: '2m ago'
    }, {
      name: 'Lihan Li',
      action: 'viewed',
      form: 'Personal Form',
      time: '5m ago'
    }, {
      name: 'Shaun Harvey',
      action: 'viewed',
      form: 'Personal Form',
      time: '1h ago'
    }, {
      name: 'Andrew Olsen',
      action: 'completed',
      form: 'Tonik Employment Form',
      time: '2h ago'
    }, {
      name: 'Someone Else',
      action: 'deleted',
      form: 'Something Important Form',
      time: '5h ago'
    }];
    const selectOptions = [
      {
        key: 'time',
        label: 'Time'
      },
      {
        key: 'something',
        label: 'Something'
      }
    ];
    return (
      <div className={classNames(styles.activitiesSection, styles.widgetPanel)}>
        <div className={styles.panelTitleWrapper}>
          <div className={styles.panelTitle}>Activity</div>
          <SelectButton className="pull-right" label="Arrange by" optionList={selectOptions} value="Time" />
        </div>
        <div className={styles.panelContent}>
          <div className={styles.activitiesWrapper}>
            <ul className={styles.activitiesList}>
              {activities.map((activity, index) => (
                <li key={`activities-${index}`} className={styles.activity}>
                  <div className={styles.activityWrapper}>
                    <div className={styles.activityContent}>
                      {activity.name}{' '}{activity.action}{' the '}
                      <span className={styles.activityForm}>{activity.form}</span>
                    </div>
                    <div className={styles.activityTime}>{activity.time}</div>
                    <div className="clearfix"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  changeAnalytics = (period) => {
    console.log(period);
  }

  renderAnalyticsPanel() {
    const analytics = {
      today: {
        view: 1235,
        rate: 0.12
      },
      week: {
        view: 13433,
        rate: 0.65
      },
      month: {
        view: 923430,
        rate: 0.78349
      }
    };
    const selectOptions = [
      {
        key: 'today',
        label: 'Today'
      },
      {
        key: 'week',
        label: 'This week'
      },
      {
        key: 'month',
        label: 'This month'
      }
    ];
    const analytic = analytics[this.props.analyticsPeriod];
    return (
      <div className={classNames(styles.analyticsSection, styles.widgetPanel)}>
        <div className={styles.panelTitleWrapper}>
          <div className={styles.panelTitle}>Analytics</div>
        </div>
        <div className={styles.panelContent}>
          <SelectButton
            className={styles.analyticsPeriod}
            optionList={selectOptions}
            value="Today"
            onChange={this.changeAnalytics} />
          <div className={styles.analyticsContent}>
            <div className={styles.analyticNumber}>{analytic.view}</div>
            <p>Unique form view</p>
            <div className={styles.analyticNumber}>{analytic.rate * 100}{'%'}</div>
            <p>Conversion rate</p>
          </div>
        </div>
      </div>
    );
  }

  renderEnvironmentalSavings() {
    return (
      <div className={classNames(styles.savingsSection, styles.widgetPanel)}>
        <div className={styles.panelTitleWrapper}>
          <div className={styles.panelTitle}>Environmental savings</div>
        </div>
        <div className={styles.panelContent}>
          <div className={styles.savings}>
            <EnvironmentSaving type="trees" value={12} size="small" font="roble" />
            <EnvironmentSaving type="water" value={3850} size="small" font="roble" />
            <EnvironmentSaving type="co2" value={120} size="small" font="roble" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      page,
      pageSize,
      totalCount
    } = this.props;
    return (
      <div className={styles.submissionsList}>
        <div className={classNames(styles.widgetPanel, styles.submissionsListInner)}>
          <SubmissionsFilter />
          {this.renderSubmissionsList()}
        </div>
        <Pagination currentPage={page} maxPage={Math.ceil(totalCount/pageSize)} />
        {this.renderActivityPanel()}
        {this.renderAnalyticsPanel()}
        {this.renderEnvironmentalSavings()}
      </div>
    );
  }
}

export default SubmissionsListView;
