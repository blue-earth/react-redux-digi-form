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
import CopyFormLinkModal from '../CopyFormLinkModal';
import styles from './FormsListView.scss';
import classNames from 'classnames';
import {
  DateCell,
  LinkCell,
  ActionsCell,
  ActionsHeaderCell,
  SortableHeaderCell,
  StatusHeaderCell
} from 'components/GriddleComponents/CommonCells';
import Icon from 'components/Icon';
import { FaEdit, FaEye, FaChain, FaCog } from 'react-icons/lib/fa';
import { FormTemplateStatus } from 'constants/formsList';

class FormsListView extends Component {
  static propTypes = {
    /*
     * redux state props
     */
    isFetchingForms: PropTypes.bool.isRequired,
    forms: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    selectedStatusFilterOptions: PropTypes.string.isRequired,
    sortColumn: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired,
    isSortAscending: PropTypes.bool.isRequired,
    selectedItems: PropTypes.array.isRequired,
    isSendingEmail: PropTypes.bool.isRequired,

    /*
     * reducer actions
     */
    fetchFormsList: PropTypes.func.isRequired,
    selectAllItems: PropTypes.func.isRequired,
    toggleSelectItem: PropTypes.func.isRequired,
    setPageSize: PropTypes.func.isRequired,
    filterFormsByStatus: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToPreviousPage: PropTypes.func.isRequired,
    archiveForms: PropTypes.func.isRequired,
    duplicateForm: PropTypes.func.isRequired,
    sendFormLink: PropTypes.func.isRequired,
    setFormStatus: PropTypes.func.isRequired,

    goTo: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired
  };

  /*
   * functions for actions menu
   */
  makeLive = (idList) => {
    this.props.setFormStatus(idList, FormTemplateStatus.LIVE.value);
  }
  makeDraft = (idList) => {
    this.props.setFormStatus(idList, FormTemplateStatus.DRAFT.value);
  }
  editForm = (idList) => {
    var id = idList[0];
    this.props.goTo(editFormUrl(id));
  }
  openSendFormModal = (idList) => {
    var id = idList[0];
    this.props.showModal('sendFormLinkModal', { formId: id });
  }
  viewForm = (idList) => {
    var id = idList[0];
    this.props.goTo(`/forms/${id}`);
  }
  copyLink = (idList, rowData) => {
    var id = idList[0];
    this.props.showModal('copyFormLinkModal', {
      formId: id,
      subdomain: rowData['subdomain'],
      slug: rowData['slug']
    });
  }
  duplicateFormAction = (idList) => {
    var id = idList[0];
    this.props.duplicateForm(id);
  }
  archiveFormAction = (idList) => {
    this.props.archiveForms(idList);
  }
  /*
   * actions menu
   */
  get actionsMenu() {
    return [
      {
        name: 'makeLive',
        label: 'Make live',
        icon: <FaCog style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [FormTemplateStatus.LIVE.label],
        onClick: this.makeLive
      },
      {
        name: 'makeDraft',
        label: 'Make draft',
        icon: <FaCog style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [FormTemplateStatus.DRAFT.label],
        onClick: this.makeDraft
      },
      {
        name: 'edit',
        label: 'Edit',
        icon: <FaEdit style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        disabledWithStatus: [FormTemplateStatus.LIVE.label],
        hiddenWithStatus: [],
        onClick: this.editForm
      },
      {
        name: 'send',
        label: 'Send',
        icon: <Icon name="Send" style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        disabledWithStatus: [FormTemplateStatus.DRAFT.label],
        hiddenWithStatus: [],
        onClick: this.openSendFormModal
      },
      {
        name: 'view',
        label: 'View',
        icon: <FaEye style={{verticalAlign: 'top'}} />,
        isInlineAction: true,
        allowMultiple: false,
        disabledWithStatus: [FormTemplateStatus.DRAFT.label],
        hiddenWithStatus: [],
        onClick: this.viewForm
      },
      {
        name: 'copyLink',
        label: 'Copy link',
        icon: <FaChain style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.copyLink
      },
      {
        name: 'duplicate',
        label: 'Duplicate',
        icon: <Icon name="Duplicate" style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: false,
        disabledWithStatus: [],
        hiddenWithStatus: [],
        onClick: this.duplicateFormAction
      },
      {
        name: 'archive',
        label: 'Archive',
        icon: <Icon name="Archive" style={{verticalAlign: 'top'}} />,
        isInlineAction: false,
        allowMultiple: true,
        disabledWithStatus: [],
        hiddenWithStatus: [],
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
      selectedStatusFilterOptions,
      filterFormsByStatus
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
            FormTemplateStatus.LIVE,
            FormTemplateStatus.DRAFT
          ],
          selectedStatusFilterOptions: selectedStatusFilterOptions,
          filterFormsByStatus: filterFormsByStatus
        }
      },
      {
        columnName: 'actions',
        order: 6,
        locked: true,
        sortable: false,
        displayName: '',
        customHeaderComponent: ActionsHeaderCell,
        customComponent: ActionsCell,
        idColumnName: 'id',
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
      isFetchingForms,
      forms,
      page,
      pageSize,
      sortColumn,
      isSortAscending,
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
        sortAscending={isSortAscending}
        Pagination={Pagination}
        isFetching={isFetchingForms}
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
      goToNextPage,
      goToPreviousPage,
      sendFormLink,
      isSendingEmail
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
          previous={goToPreviousPage}
          next={goToNextPage} />
        <SendFormLinkModal sendFormLink={sendFormLink} isPageBusy={isSendingEmail} />
        <CopyFormLinkModal />
      </div>
    );
  }
}

export default FormsListView;
