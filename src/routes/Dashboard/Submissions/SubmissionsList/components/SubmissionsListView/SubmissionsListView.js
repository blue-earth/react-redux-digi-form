import React, {
  Component,
  PropTypes
} from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import {
  AuthorHeaderCell,
  ProgressHeaderCell,
  StatusHeaderCell,
  ContactInfoCell,
  ActionsCell
} from '../CustomCells/CustomCells';
import Pagination from '../../containers/PaginationContainer';
import {
  FaSortAlphaAsc,
  FaSortAlphaDesc
} from 'react-icons/lib/fa';

import styles from './SubmissionsListView.scss';

class SubmissionsListView extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * submissions: Redux state that indicates whether the requested form is being fetched from backend
     */
    submissions: PropTypes.array.isRequired,

    /*
     * fetchSubmissions: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchSubmissions: PropTypes.func.isRequired,

    page: PropTypes.number.isRequired,

    pageSize: PropTypes.number.isRequired,

    totalCount: PropTypes.number.isRequired,

    sortColumn: PropTypes.string.isRequired,

    sortAscending: PropTypes.bool.isRequired
  };

  /*
   * setPage: what page is currently viewed
   * A Wrapper Component methods for External Data
   */
  setPage = (index) => {
    const maxPages = this.maxPages;
    const page = index > maxPages ? maxPages - 1 : index < 1 ? 0 : index;
    this.getExternalData({ page });
  }

  /*
   * changeSort: this changes whether data is sorted in ascending or descending order
   * A Wrapper Component methods for External Data
   */
  changeSort = (sortColumn, sortAscending) => {
    this.getExternalData({
      sortColumn,
      sortAscending
    });

    // Enable sort direction icon which is disabled when useExternal is set.
    const { griddle } = this.refs;
    griddle && griddle.setState({ sortDirection: sortAscending ? 'asc' : 'desc' });
  }

  /*
   * changeSort: this method handles the filtering of the data
   * A Wrapper Component methods for External Data
   */
  setFilter = (filter) => {
  }

  /*
   * changeSort: this method handles determining the page size
   * A Wrapper Component methods for External Data
   */
  setPageSize = (pageSize) => {
    this.getExternalData({
      page: 0,
      pageSize
    });
  }

  getExternalData(options) {
    const { fetchSubmissions } = this.props;
    fetchSubmissions(options);
  }

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
        columnName: 'title',
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
        cssClassName: styles.columnCreated
      },
      {
        columnName: 'status',
        order: 8,
        locked: false,
        visible: true,
        displayName: 'Status',
        cssClassName: styles.columnStatus
      },
      {
        columnName: 'type',
        order: 9,
        locked: false,
        visible: true,
        displayName: 'Type',
        customHeaderComponent: StatusHeaderCell,
        cssClassName: styles.columnType
      },
      {
        columnName: 'language',
        order: 10,
        locked: false,
        visible: true,
        displayName: 'Language',
        cssClassName: styles.columnLanguage
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

  get columns() {
    return _.map(
      _.filter(this.columnMetadata, (o) => (o.visible !== false)),
      'columnName'
    );
  }

  get resultsData() {
    const { submissions } = this.props;
    const defaultRowValues = {};
    this.columns.forEach(column => { defaultRowValues[column] = ''; });
    return _.map(submissions, (submission) =>
      Object.assign({}, defaultRowValues, submission)
    );
  }

  get maxPages() {
    const { totalCount, pageSize } = this.props;
    return Math.ceil(totalCount / pageSize);
  }

  getSortIcon(sortAscending) {
    return (
      <span className={styles.sortIcon}>
        {sortAscending ? <FaSortAlphaAsc size={16} /> : <FaSortAlphaDesc size={16} />}
      </span>
    );
  }

  renderSubmissionsList() {
    const {
      // isFetching,
      page,
      pageSize,
      sortColumn,
      sortAscending
    } = this.props;
    return (
      <div className={styles.tableWrapper}>
        <Griddle
          results={this.resultsData}
          columnMetadata={this.columnMetadata}
          columns={this.columns}
          useExternal
          externalSetPage={this.setPage}
          externalChangeSort={this.changeSort}
          externalSetFilter={this.setFilter}
          externalSetPageSize={this.setPageSize}
          externalMaxPage={this.maxPages}
          externalCurrentPage={page}
          resultsPerPage={pageSize}
          externalSortColumn={sortColumn}
          externalSortAscending={sortAscending}
          initialSort="response_id"
          useGriddleStyles={false}
          sortAscendingComponent={this.getSortIcon(true)}
          sortDescendingComponent={this.getSortIcon(false)}
          sortAscendingClassName={styles.sortedCell}
          sortDescendingClassName={styles.sortedCell}
          tableClassName={styles.resultsTable}
          useCustomPagerComponent
          customPagerComponent={Pagination}
          // externalIsLoading={isFetching}
          ref="griddle"
        />
        {this.renderLoadingSpinner()}
      </div>
    );
  }

  renderLoadingSpinner() {
    const { isFetching } = this.props;
    return (
      <div className={styles.loadingSpinner}
        style={{display: isFetching ? 'block' : 'none'}}
      >
      </div>
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
