import React, {
  Component,
  PropTypes
} from 'react';
import {
  DateCell,
  ActionsCell
} from '../CustomCells/CustomCells';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';

import styles from './FormsListView.scss';

class FormsListView extends Component {
  static propTypes = {
    /*
     * isFetching: Redux state that indicates whether the requested form is being fetched from backend
     */
    isFetching: PropTypes.bool.isRequired,

    /*
     * forms: Redux state that indicates whether the requested form is being fetched from backend
     */
    forms: PropTypes.array.isRequired,

    /*
     * fetchFormsList: Redux action to fetch form from backend with ID specified by request parameters
     */
    fetchFormsList: PropTypes.func.isRequired,

    page: PropTypes.number.isRequired,

    pageSize: PropTypes.number.isRequired,

    totalCount: PropTypes.number.isRequired,

    sortColumn: PropTypes.string.isRequired,

    sortAscending: PropTypes.bool.isRequired
  };

  get columnMetadata() {
    return [
      {
        'columnName': 'id',
        'order': 1,
        'locked': false,
        'visible': true,
        'displayName': 'ID',
        cssClassName: styles.columnID
      },
      {
        'columnName': 'title',
        'order': 2,
        'locked': false,
        'visible': true,
        'displayName': 'Name',
        cssClassName: styles.columnName
      },
      {
        'columnName': 'author',
        'order': 3,
        'locked': false,
        'visible': true,
        'displayName': 'Created by',
        cssClassName: styles.columnCreatedBy
      },
      {
        'columnName': 'created',
        'order': 4,
        'locked': false,
        'visible': true,
        'displayName': 'Created',
        'customComponent': DateCell,
        cssClassName: styles.columnCreated
      },
      {
        'columnName': 'status',
        'order': 5,
        'locked': false,
        'visible': true,
        'displayName': 'Status',
        cssClassName: styles.columnStatus
      },
      {
        'columnName': 'slug',
        'locked': true,
        'visible': false
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

  renderFormsList() {
    const {
      isFetching,
      forms,
      page,
      pageSize,
      sortColumn,
      sortAscending,
      fetchFormsList,
      totalCount
    } = this.props;
    return (
      <GriddleTable
        results={forms}
        columnMetadata={this.columnMetadata}
        fetchList={fetchFormsList}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        sortColumn={sortColumn}
        sortAscending={sortAscending}
        Pagination={Pagination}
        initialSort="id"
        isFetching={isFetching}
      />
    );
  }

  render() {
    return (
      <div className={styles.formsList}>
        <div className={styles.formsListInner}>
          {this.renderFormsList()}
        </div>
      </div>
    );
  }
}

export default FormsListView;
