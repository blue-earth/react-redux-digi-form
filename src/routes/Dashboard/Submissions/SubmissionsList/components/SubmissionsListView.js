import React, {
  Component,
  PropTypes
} from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import {
  AuthorHeaderCell,
  ProgressHeaderCell,
  TypeHeaderCell,
  ActionsCell
} from './CustomCells';
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

    setPageSize: PropTypes.func.isRequired,

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
        'columnName': 'response_id',
        'order': 1,
        'locked': false,
        'visible': true,
        'displayName': 'ID'
      },
      {
        'columnName': 'title',
        'order': 2,
        'locked': false,
        'visible': true,
        'displayName': 'Name'
      },
      {
        'columnName': 'progress',
        'order': 3,
        'locked': false,
        'visible': true,
        'displayName': 'Progress',
        'customHeaderComponent': ProgressHeaderCell
      },
      {
        'columnName': 'completion_percent',
        'order': 4,
        'locked': false,
        'visible': true,
        'displayName': '%'
      },
      {
        'columnName': 'completed_by_name',
        'order': 5,
        'locked': false,
        'visible': true,
        'displayName': 'Created by',
        'customHeaderComponent': AuthorHeaderCell
      },
      {
        'columnName': 'sent_channel',
        'order': 6,
        'locked': false,
        'visible': true,
        'displayName': 'Channel'
      },
      {
        'columnName': 'created',
        'order': 7,
        'locked': false,
        'visible': true,
        'displayName': 'Created'
      },
      {
        'columnName': 'status',
        'order': 8,
        'locked': false,
        'visible': true,
        'displayName': 'Status'
      },
      {
        'columnName': 'type',
        'order': 9,
        'locked': false,
        'visible': true,
        'displayName': 'Type',
        'customHeaderComponent': TypeHeaderCell
      },
      {
        'columnName': 'duration_seconds',
        'order': 10,
        'locked': false,
        'visible': true,
        'displayName': 'Time taken'
      },
      {
        'columnName': 'contact_email',
        'order': 10,
        'locked': false,
        'visible': true,
        'displayName': 'Contact Email'
      },
      {
        'columnName': 'contact_phone',
        'order': 10,
        'locked': false,
        'visible': true,
        'displayName': 'Contact Phone'
      },
      {
        'columnName': 'actions',
        'order': 6,
        'locked': true,
        'sortable': false,
        'displayName': '',
        'customComponent': ActionsCell
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
    return _.map(submissions, (submission) =>
      Object.assign({}, submission, { actions: '' })
    );
  }

  get maxPages() {
    const { totalCount, pageSize } = this.props;
    return Math.ceil(totalCount / pageSize);
  }

  renderSubmissionsList() {
    const {
      // isFetching,
      totalCount,
      page,
      pageSize,
      sortColumn,
      sortAscending
    } = this.props;
    return (
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
        showFilter
        showSettings
        // externalIsLoading={isFetching}
      />
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
          {this.renderLoadingSpinner()}
        </div>
      </div>
    );
  }
}

export default SubmissionsListView;
