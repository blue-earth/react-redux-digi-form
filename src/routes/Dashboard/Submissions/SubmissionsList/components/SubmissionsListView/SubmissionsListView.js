import React, {
  Component,
  PropTypes
} from 'react';
import {
  AuthorHeaderCell,
  ProgressHeaderCell,
  StatusHeaderCell,
  ContactInfoCell,
  DateCell,
  ActionsCell
} from '../CustomCells/CustomCells';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';

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

    page: PropTypes.number.isRequired,

    pageSize: PropTypes.number.isRequired,

    totalCount: PropTypes.number.isRequired,

    sortColumn: PropTypes.string.isRequired,

    sortAscending: PropTypes.bool.isRequired
  };

  get columnMetadata() {
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
        columnName: 'progress',
        order: 3,
        locked: false,
        visible: true,
        displayName: 'Progress',
        customHeaderComponent: ProgressHeaderCell,
        cssClassName: styles.columnProgress
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
        columnName: 'status',
        order: 8,
        locked: false,
        visible: true,
        displayName: 'Status',
        customHeaderComponent: StatusHeaderCell,
        cssClassName: styles.columnStatus
      },
      {
        columnName: 'duration_seconds',
        order: 11,
        locked: false,
        visible: true,
        displayName: 'Time taken',
        cssClassName: styles.columnDuration
      },
      {
        columnName: 'contact_info',
        order: 12,
        locked: false,
        visible: true,
        sortable: false,
        displayName: 'Contact Info',
        customComponent: ContactInfoCell,
        cssClassName: styles.columnContactInfo
      },
      {
        columnName: 'actions',
        locked: true,
        sortable: false,
        displayName: '',
        customComponent: ActionsCell
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
      />
    );
  }

  render() {
    return (
      <div className={styles.submissionsList}>
        <div className={styles.submissionsListInner}>
          {this.renderSubmissionsList()}
        </div>
      </div>
    );
  }
}

export default SubmissionsListView;
