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
  SortableHeaderCell,
  StatusHeaderCell
} from 'components/GriddleComponents/CommonCells';
import Icon from 'components/Icon';
import { FaEdit, FaEye, FaChain, FaDownload } from 'react-icons/lib/fa';

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
    selectedItems: PropTypes.array.isRequired,
    selectedStatus: PropTypes.string,
    setStatus: PropTypes.func
  };

  /*
   * functions for actions menu
   */
  editForm = (id) => {
    if (!Array.isArray(id)) {
      this.props.goTo(editFormUrl(id));
    }
  }
  openSendFormModal = (id) => {
    if (!Array.isArray(id)) {
      this.props.showModal('sendFormLinkModal', { formId: id });
    }
  }
  viewForm = (id) => {
    if (!Array.isArray(id)) {
      this.props.goTo(`/forms/${id}`);
    }
  }
  copyLink = (id) => {
    console.log('TODO copy link action', id);
  }
  duplicateFormAction = (id) => {
    if (!Array.isArray(id)) {
      this.props.duplicateForm(id);
    }
  }
  downloadCSV = (id) => {
    console.log('TODO download CSV action', id);
  }
  archiveFormAction = (id) => {
    if (Array.isArray(id)) {
      this.props.archiveForms(id);
    } else {
      this.props.archiveForm(id);
    }
  }
  /*
   * actions menu
   */
  get actionsMenu() {
    return [
      {
        name: 'edit',
        label: 'Edit',
        icon: <FaEdit style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        withStatus: ['Draft'],
        onClick: this.editForm
      },
      {
        name: 'send',
        label: 'Send',
        icon: <Icon name="Send" style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        withStatus: ['Live'],
        onClick: this.openSendFormModal
      },
      {
        name: 'view',
        label: 'View',
        icon: <FaEye style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        withStatus: ['Live'],
        onClick: this.viewForm
      },
      {
        name: 'copyLink',
        label: 'Copy link',
        icon: <FaChain style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        withStatus: ['Draft', 'Live'],
        onClick: this.copyLink
      },
      {
        name: 'duplicate',
        label: 'Duplicate',
        icon: <Icon name="Duplicate" style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        withStatus: ['Draft', 'Live'],
        onClick: this.duplicateFormAction
      },
      {
        name: 'csv',
        label: 'Download CSV',
        icon: <FaDownload style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        withStatus: ['Draft', 'Live'],
        onClick: this.downloadCSV
      },
      {
        name: 'archive',
        label: 'Archive',
        icon: <Icon name="Archive" style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        withStatus: ['Draft', 'Live'],
        onClick: this.archiveFormAction
      }
    ];
  }

  get columnMetadata() {
    const {
      selectAllItems,
      forms,
      selectedItems,
      toggleSelectItem,
      goTo,
      selectedStatus,
      setStatus
    } = this.props;
    const getActions = this.actionsMenu;
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
        displayName: 'Form name',
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
        sortable: false,
        displayName: 'Status',
        customHeaderComponent: StatusHeaderCell,
        cssClassName: styles.columnStatus,
        customHeaderComponentProps: {
          statusList: [
            {label: 'Live', value: '1'},
            {label: 'Draft', value: '0'}
          ],
          selectedStatus: selectedStatus,
          setStatus: setStatus
        }
      },
      {
        columnName: 'actions',
        order: 6,
        locked: true,
        sortable: false,
        displayName: '',
        customHeaderComponent: SelectionHeaderCell,
        customComponent: SelectionCell,
        idName: 'id',
        actionsMenu: getActions,
        selectedItems,
        toggleSelectItem,
        cssClassName: styles.columnActions,
        customHeaderComponentProps: {
          actionsMenu: getActions,
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
