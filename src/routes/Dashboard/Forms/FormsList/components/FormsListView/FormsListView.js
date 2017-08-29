import React, {
  Component,
  PropTypes
} from 'react';
import {
  DateCell
} from '../CustomCells/CustomCells';
import { formsUrl, editFormUrl } from 'helpers/urlHelper';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';
import FormsFilter from '../FormsFilter';
import styles from './FormsListView.scss';
import classNames from 'classnames';
import { SelectionCell, SelectionHeaderCell, LinkCell } from 'components/GriddleComponents/CommonCells/CommonCells';
import Icon from 'components/Icon';

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
     * goTo: Redux action to go to specific url.
     */
    goTo: PropTypes.func.isRequired,

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

    setPageSize: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    previous: PropTypes.func.isRequired,
    deleteForm: PropTypes.func.isRequired,
    duplicateForm: PropTypes.func.isRequired,
    archiveForm: PropTypes.func.isRequired,

    /*
     * selectedItems: Redux state in array to hold selected item ids.
     */
    selectedItems: PropTypes.array.isRequired
  };

  get columnMetadata() {
    const {
      selectAllItems,
      forms,
      selectedItems,
      toggleSelectItem,
      goTo,
      deleteForm,
      duplicateForm,
      archiveForm
    } = this.props;
    return [
      {
        columnName: 'id',
        order: 1,
        locked: false,
        visible: true,
        displayName: 'ID',
        customComponent: LinkCell,
        idName: 'id',
        goTo,
        url: editFormUrl,
        cssClassName: styles.columnID
      },
      {
        columnName: 'title',
        order: 2,
        locked: false,
        visible: true,
        displayName: 'Name',
        customComponent: LinkCell,
        idName: 'id',
        goTo,
        url: editFormUrl,
        cssClassName: styles.columnName
      },
      {
        columnName: 'created_by',
        order: 3,
        locked: false,
        visible: true,
        displayName: 'Created by',
        cssClassName: styles.columnCreatedBy
      },
      {
        columnName: 'created',
        order: 4,
        locked: false,
        visible: true,
        displayName: 'Created',
        customComponent: DateCell,
        cssClassName: styles.columnCreated
      },
      {
        columnName: 'status',
        order: 5,
        locked: false,
        visible: true,
        displayName: 'Status',
        cssClassName: styles.columnStatus
      },
      {
        columnName: 'slug',
        locked: true,
        visible: false
      },
      {
        columnName: 'actions',
        order: 6,
        locked: true,
        sortable: false,
        displayName: '',
        customHeaderComponent: SelectionHeaderCell,
        customComponent: SelectionCell,
        inlineActions: [{
          name: 'send',
          label: 'Send',
          icon: <Icon name="Send" height={16} width={16} style={{verticalAlign: 'top'}} />,
          onClick: (id) => console.log(id)
        }],
        idName: 'id',
        dropdownMenus: [{
          name: 'send',
          label: 'Send',
          icon: 'Send'
        }, {
          name: 'archive',
          label: 'Archive',
          icon: 'Archive',
          onClick: (id) => archiveForm(id)
        }, {
          name: 'duplicate',
          label: 'Duplicate',
          icon: 'Duplicate',
          onClick: (id) => duplicateForm(id)
        }, {
          name: 'delete',
          label: 'Delete',
          icon: 'Delete',
          onClick: (id) => deleteForm(id)
        }],
        selectedItems,
        toggleSelectItem,
        cssClassName: styles.columnActions,
        customHeaderComponentProps: {
          dropdownMenus: [{
            name: 'archive',
            label: 'Archive',
            icon: 'Archive'
          }],
          selectAllItems,
          isAllSelected: forms.length === selectedItems.length
        }
      }
    ];
  }

  handleCreateForm = () => {
    const { goTo } = this.props;
    goTo(formsUrl('new'));
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
    const {
      page,
      pageSize,
      totalCount,
      setPageSize,
      selectedItems,
      next,
      previous
    } = this.props;
    return (
      <div className={styles.formsList}>
        <div className={classNames(styles.widgetPanel, styles.formsListInner)}>
          <FormsFilter
            setPageSize={setPageSize}
            pageSize={pageSize}
            handleCreateForm={this.handleCreateForm}
            selectedItems={selectedItems}
          />
          {this.renderFormsList()}
        </div>
        <Pagination
          currentPage={page}
          maxPage={Math.ceil(totalCount / pageSize)}
          previous={previous}
          next={next} />
      </div>
    );
  }
}

export default FormsListView;
