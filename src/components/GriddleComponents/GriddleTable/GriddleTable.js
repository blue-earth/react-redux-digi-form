import React, {
  Component,
  PropTypes
} from 'react';
import Griddle from 'griddle-react';
import _ from 'lodash';
import {
  FaSortAlphaAsc,
  FaSortAlphaDesc,
  FaCaretDown,
  FaCaretUp
} from 'react-icons/lib/fa';

import styles from './GriddleTable.scss';

class GriddleTable extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * results: Redux state that indicates whether the requested form is being fetched from backend
     */
    results: PropTypes.array.isRequired,

    /*
     * fetchList: Map to redux action to fetch table data from backend
     */
    fetchList: PropTypes.func.isRequired,

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
     * columnMetadata: Column metadata for Griddle
     */
    columnMetadata: PropTypes.array.isRequired,

    /*
     * Pagination: Custom pagination component
     */
    Pagination: PropTypes.any,

    /*
     * initialSort: Column Id to sort by on init.
     */
    initialSort: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),

    /*
     * tableClassName: Styling Table Classname
     */
    tableClassName: PropTypes.string
  };

  static defaultProps = {
    initialSort: null,
    columnMetadata: [],
    tableClassName: styles.resultsTable
  }

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
    const { fetchList } = this.props;
    fetchList(options);
  }

  get columnMetadata() {
    return this.props.columnMetadata;
  }

  get columns() {
    return _.map(
      _.filter(this.columnMetadata, (o) => (o.visible !== false)),
      'columnName'
    );
  }

  get resultsData() {
    const { results } = this.props;
    const defaultRowValues = {};
    this.columns.forEach(column => { defaultRowValues[column] = ''; });
    return _.map(results, (row) =>
      Object.assign({}, defaultRowValues, row)
    );
  }

  get maxPages() {
    const { totalCount, pageSize } = this.props;
    return Math.ceil(totalCount / pageSize);
  }

  getSortIcon(sortAscending) {
    return (
      <span className={styles.sortIcon}>
        {sortAscending ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />}
      </span>
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
    const {
      page,
      pageSize,
      sortColumn,
      sortAscending,
      initialSort,
      Pagination,
      tableClassName
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
          initialSort={initialSort}
          useGriddleStyles={false}
          sortAscendingComponent={this.getSortIcon(true)}
          sortDescendingComponent={this.getSortIcon(false)}
          sortAscendingClassName={styles.sortedCell}
          sortDescendingClassName={styles.sortedCell}
          tableClassName={tableClassName}
          useCustomPagerComponent
          customPagerComponent={Pagination}
          // externalIsLoading={isFetching}
          ref="griddle"
        />
        {this.renderLoadingSpinner()}
      </div>
    );
  }
}

export default GriddleTable;
