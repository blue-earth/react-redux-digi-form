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
import styles from './SubmissionsListView.scss';
import tableStyles from './tableStyles.scss';

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
    selectedItems: PropTypes.array.isRequired
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
        Pagination={''}
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

  render() {
    const {
      page,
      pageSize,
      totalCount
    } = this.props;
    return (
      <div className={styles.submissionsList}>
        <div className={styles.submissionsListInner}>
          <SubmissionsFilter />
          {this.renderSubmissionsList()}
        </div>
        <Pagination currentPage={page} maxPage={Math.ceil(totalCount/pageSize)} />
      </div>
    );
  }
}

export default SubmissionsListView;
