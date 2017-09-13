import React, {
  Component,
  PropTypes
} from 'react';
import {
  dashboardUrl
} from 'helpers/urlHelper';
import {
  DateCell,
  // LinkCell,
  ActionsCell,
  StatusCell,
  ActionsHeaderCell,
  SortableHeaderCell,
  StatusHeaderCell
} from 'components/GriddleComponents/CommonCells';
import SubmissionsFilter from '../SubmissionsFilter';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';
import SelectButton from 'components/Buttons/SelectButton';
import EnvironmentSaving from 'components/EnvironmentSaving';
import DownloadModal from '../DownloadModal';
import Icon from 'components/Icon';
import { FaCheck, FaClose, FaEye, FaFilePdfO, FaFileTextO, FaCog } from 'react-icons/lib/fa';
import classNames from 'classnames';
import styles from './SubmissionsListView.scss';
import { FormResponseStatus } from 'constants/formsList';

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

    selectedStatusFilterOptions: PropTypes.string.isRequired,

    /*
     * selectAllItems: Redux action to select all the rows in table
     */
    selectAllItems: PropTypes.func.isRequired,

    /*
     * toggleSelectItem: Redux action to select or deselect item by id.
     */
    toggleSelectItem: PropTypes.func.isRequired,
    selectAnalyticsPeriod: PropTypes.func.isRequired,

    setPageSize: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
    filterSubmissionsByStatus: PropTypes.func.isRequired,
    /*
     * selectedItems: Redux state in array to hold selected item ids.
     */
    selectedItems: PropTypes.array.isRequired,
    analyticsPeriod: PropTypes.string.isRequired,
    analytics: PropTypes.object,
    activities: PropTypes.array,
    environmentalSavings: PropTypes.object,
    goTo: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired
  };

  /*
   * functions for actions menu
   */
  viewSubmission = (idList, rowData) => {
    var id = idList[0];
    this.props.goTo(dashboardUrl(`submissions/${rowData.form_id}/${id}/`));
  }
  assignSubmission = (idList) => {
    console.log('TODO assign submission');
  }
  downloadSubmissionPDF = (idList) => {
    var id = idList[0];
    this.props.showModal('downloadModal', {
      responseId: id,
      fileType: 'PDF'
    });
  }
  downloadSubmissionCSV = (idList) => {
    var id = idList[0];
    this.props.showModal('downloadModal', {
      responseId: id,
      fileType: 'CSV'
    });
  }
  sendResumeLink = (idList) => {
    console.log('TODO send link');
  }
  acceptSubmission = (idList) => {
    console.log('TODO accept');
  }
  cancelSubmission = (idList) => {
    console.log('TODO cancel');
  }

  /*
   * actions menu
   */
  get actionsMenu() {
    return [
      {
        name: 'view',
        label: 'View',
        icon: <FaEye style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.viewSubmission
      },
      {
        name: 'assign',
        label: 'Assign',
        icon: <FaCog style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.assignSubmission
      },
      {
        name: 'downloadPDF',
        label: 'Download PDF',
        icon: <FaFilePdfO style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.downloadSubmissionPDF
      },
      {
        name: 'downloadCSV',
        label: 'Download CSV',
        icon: <FaFileTextO style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.downloadSubmissionCSV
      },
      {
        name: 'sendResumeLink',
        label: 'Send resume link',
        icon: <Icon name="Send" style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.sendResumeLink
      },
      {
        name: 'accept',
        label: 'Accept',
        icon: <FaCheck style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.acceptSubmission
      },
      {
        name: 'cancel',
        label: 'Cancel',
        icon: <FaClose style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.cancelSubmission
      }
    ];
  }

  get columnMetadata() {
    const {
      selectAllItems,
      submissions,
      selectedItems,
      toggleSelectItem,
      selectedStatusFilterOptions,
      filterSubmissionsByStatus
    } = this.props;
    const getActions = this.actionsMenu;
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
        displayName: 'Form name',
        cssClassName: styles.columnName
      },
      {
        columnName: 'completed_by_name',
        order: 3,
        locked: false,
        visible: true,
        displayName: 'Completed by',
        cssClassName: styles.columnAuthor
      },
      {
        columnName: 'created',
        order: 4,
        locked: false,
        visible: true,
        displayName: 'Received',
        cssClassName: styles.columnCreated,
        customComponent: DateCell,
        customHeaderComponent: SortableHeaderCell
      },
      {
        columnName: 'assigned_to',
        order: 5,
        locked: false,
        visible: true,
        displayName: 'Assigned to',
        cssClassName: styles.assignedTo
      },
      {
        columnName: 'completion_percent',
        order: 6,
        locked: false,
        visible: true,
        displayName: '%',
        cssClassName: styles.columnPercent
      },
      {
        columnName: 'status',
        order: 7,
        locked: false,
        visible: true,
        sortable: false,
        displayName: 'Status',
        customComponent: StatusCell,
        customHeaderComponent: StatusHeaderCell,
        cssClassName: styles.columnStatus,
        customHeaderComponentProps: {
          statusList: [
            FormResponseStatus.HIDDEN,
            FormResponseStatus.UNOPENED,
            FormResponseStatus.OPENED,
            FormResponseStatus.SAVED,
            FormResponseStatus.RECEIVED,
            FormResponseStatus.ABANDONED,
            FormResponseStatus.AUTO_SAVED,
            FormResponseStatus.ADMIN_EDITED
          ],
          selectedStatusFilterOptions: selectedStatusFilterOptions,
          filterFormsByStatus: filterSubmissionsByStatus
        }
      },
      {
        columnName: 'identification_status',
        order: 8,
        locked: false,
        visible: true,
        displayName: 'Identification',
        cssClassName: styles.idStatus
      },
      {
        columnName: 'actions',
        order: 9,
        locked: true,
        sortable: false,
        displayName: '',
        customHeaderComponent: ActionsHeaderCell,
        customComponent: ActionsCell,
        idColumnName: 'response_id',
        actionsMenu: getActions,
        selectedItems,
        toggleSelectItem,
        cssClassName: styles.columnActions,
        customHeaderComponentProps: {
          actionsMenu: getActions,
          selectedItems,
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
        isFetching={isFetching}
        showFilter
        useCustomFilterComponent
        customFilterComponent={SubmissionsFilter}
        showSettings
      />
    );
  }

  renderActivityPanel() {
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
              {this.props.activities.map((activity, index) => (
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

  renderAnalyticsPanel() {
    const selectOptions = [
      {
        key: 'today',
        label: 'Today'
      },
      {
        key: 'week',
        label: 'This week'
      }
    ];
    const { analytics, analyticsPeriod, selectAnalyticsPeriod } = this.props;
    const analytic = analytics[analyticsPeriod];
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
            onChange={selectAnalyticsPeriod} />
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
    const { trees, water, co2 } = this.props.environmentalSavings;
    return (
      <div className={classNames(styles.savingsSection, styles.widgetPanel)}>
        <div className={styles.panelTitleWrapper}>
          <div className={styles.panelTitle}>Environmental savings</div>
        </div>
        <div className={styles.panelContent}>
          <div className={styles.savings}>
            <EnvironmentSaving type="trees" value={trees} isWidget />
            <EnvironmentSaving type="water" value={water} isWidget />
            <EnvironmentSaving type="co2" value={co2} isWidget />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      page,
      pageSize,
      totalCount,
      setPageSize,
      selectedItems,
      goToNextPage,
      goToPreviousPage
    } = this.props;
    return (
      <div className={styles.submissionsList}>
        <div className={classNames(styles.widgetPanel, styles.submissionsListInner)}>
          <SubmissionsFilter
            refresh={this.props.fetchSubmissions}
            setPageSize={setPageSize}
            pageSize={pageSize}
            selectedItems={selectedItems}
          />
          {this.renderSubmissionsList()}
        </div>
        <Pagination
          currentPage={page}
          maxPage={Math.ceil(totalCount / pageSize)}
          previous={goToPreviousPage}
          next={goToNextPage} />
        {this.renderEnvironmentalSavings()}
        <DownloadModal />
      </div>
    );
  }
}

export default SubmissionsListView;
