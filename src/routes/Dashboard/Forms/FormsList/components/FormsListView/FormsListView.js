import React, {
  Component,
  PropTypes
} from 'react';
import {
  formsUrl,
  editFormUrl
} from 'helpers/urlHelper';
import GriddleTable from 'components/GriddleComponents/GriddleTable';
import Pagination from '../../containers/PaginationContainer';
import FormsFilter from '../FormsFilter';
import SendFormLinkModal from '../SendFormLinkModal';
import styles from './FormsListView.scss';
import classNames from 'classnames';
import {
  DateCell,
  LinkCell,
  SelectionCell,
  SelectionHeaderCell,
  SortableHeaderCell
} from 'components/GriddleComponents/CommonCells';
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
    duplicateForm: PropTypes.func.isRequired,
    archiveForm: PropTypes.func.isRequired,
    archiveForms: PropTypes.func.isRequired,
    sendFormLink: PropTypes.func.isRequired,
    isPageBusy: PropTypes.bool.isRequired,

    showModal: PropTypes.func.isRequired,

    /*
     * selectedItems: Redux state in array to hold selected item ids.
     */
    selectedItems: PropTypes.array.isRequired
  };

  openSendFormModal = (id) => {
    this.props.showModal('sendFormLinkModal', { formId: id });
  }

  get columnMetadata() {
    const {
      selectAllItems,
      forms,
      selectedItems,
      toggleSelectItem,
      goTo,
      duplicateForm,
      archiveForm,
      archiveForms
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
        customHeaderComponent: SortableHeaderCell,
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
        customHeaderComponent: SortableHeaderCell,
        cssClassName: styles.columnName
      },
      {
        columnName: 'created_by',
        order: 3,
        locked: false,
        visible: true,
        displayName: 'Created by',
        customHeaderComponent: SortableHeaderCell,
        cssClassName: styles.columnCreatedBy
      },
      {
        columnName: 'created',
        order: 4,
        locked: false,
        visible: true,
        displayName: 'Created',
        customComponent: DateCell,
        customHeaderComponent: SortableHeaderCell,
        cssClassName: styles.columnCreated
      },
      {
        columnName: 'status',
        order: 5,
        locked: false,
        visible: true,
        displayName: 'Status',
        customHeaderComponent: SortableHeaderCell,
        cssClassName: styles.columnStatus
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
          onClick: (id) => this.openSendFormModal(id)
        }],
        idName: 'id',
        dropdownMenus: [{
          name: 'send',
          label: 'Send',
          icon: 'Send',
          onClick: (id) => this.openSendFormModal(id)
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
        }],
        selectedItems,
        toggleSelectItem,
        cssClassName: styles.columnActions,
        customHeaderComponentProps: {
          dropdownMenus: [{
            name: 'archive',
            label: 'Archive',
            icon: 'Archive',
            onClick: (items) => archiveForms(items)
          }],
          selectedItems,
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
      fetchFormsList,
      page,
      pageSize,
      totalCount,
      setPageSize,
      selectedItems,
      next,
      previous,
      sendFormLink,
      isPageBusy
    } = this.props;
    return (
      <div className={styles.formsList}>
        <div className={classNames(styles.widgetPanel, styles.formsListInner)}>
          <FormsFilter
            refresh={fetchFormsList}
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
        <SendFormLinkModal sendFormLink={sendFormLink} isPageBusy={isPageBusy} />
      </div>
    );
  }
}

export default FormsListView;
