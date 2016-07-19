import React, {
  Component,
  PropTypes
} from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import ActionsComponent from './ActionsComponent';
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

    currentPage: PropTypes.number.isRequired,

    pageSize: PropTypes.number.isRequired,

    totalCount: PropTypes.number.isRequired,

    setPageSize: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      results: props.submissions,
      currentPage: props.currentPage,
      maxPages: Math.ceil(props.totalCount / props.pageSize),
      externalResultsPerPage: props.pageSize,
      externalSortColumn: null,
      externalSortAscending: true
    };
  }

  componentDidMount() {
    this.getExternalData();
  }

  componentWillReceiveProps(props) {
    // TODO: remove tempstartIndex and implement paginated data response in the backend.
    const tempStartIndex = (props.currentPage - 1) * props.pageSize;
    this.setState({
      results: props.submissions.slice(tempStartIndex, tempStartIndex + props.pageSize),
      currentPage: props.currentPage,
      maxPages: Math.ceil(props.totalCount / props.pageSize),
      externalResultsPerPage: props.pageSize
    });
  }

  /*
   * setPage: what page is currently viewed
   * A Wrapper Component methods for External Data
   */
  setPage = (index) => {
    const { maxPages } = this.state;
    const page = index > maxPages ? maxPages : index < 1 ? 1 : index + 1;
    this.getExternalData(page);
  }

  /*
   * sortData: this will handle how the data is sorted
   * A Wrapper Component methods for External Data
   */
  sortData = (sort, sortAscending, data) => {
  }

  /*
   * changeSort: this changes whether data is sorted in ascending or descending order
   * A Wrapper Component methods for External Data
   */
  changeSort = (sort, sortAscending) => {
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
  setPageSize(size) {
  }

  getExternalData(page) {
    const { fetchSubmissions } = this.props;
    page = page || 1;
    fetchSubmissions(page);
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
        'displayName': 'Progress'
      },
      {
        'columnName': 'percent',
        'order': 4,
        'locked': false,
        'visible': true,
        'displayName': '%'
      },
      {
        'columnName': 'author',
        'order': 5,
        'locked': false,
        'visible': true,
        'displayName': 'Created by'
      },
      {
        'columnName': 'channel',
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
        'displayName': 'Type'
      },
      {
        'columnName': 'duration',
        'order': 10,
        'locked': false,
        'visible': true,
        'displayName': 'Time taken'
      },
      {
        'columnName': 'contact',
        'order': 10,
        'locked': false,
        'visible': true,
        'displayName': 'Contact Info'
      },
      {
        'columnName': 'actions',
        'order': 6,
        'locked': true,
        'sortable': false,
        'displayName': '',
        'customComponent': ActionsComponent
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
    const { results } = this.state;
    return _.map(results, (submission) =>
      Object.assign({}, submission, { actions: '' })
    );
  }

  renderSubmissionsList() {
    const {
      maxPages,
      currentPage,
      externalResultsPerPage,
      externalSortColumn,
      externalSortAscending
    } = this.state;
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
        externalMaxPage={maxPages}
        externalCurrentPage={currentPage - 1}
        resultsPerPage={externalResultsPerPage}
        externalSortColumn={externalSortColumn}
        externalSortAscending={externalSortAscending}
        showFilter
        showSettings
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
