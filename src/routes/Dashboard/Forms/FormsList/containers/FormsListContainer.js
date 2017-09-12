import connect from 'redux/utils/connect';
import {
  INIT_FORMSLIST_STATE,
  fetchFormsList,
  selectAllItems,
  toggleSelectItem,
  setPageSize,
  filterFormsByStatus,
  goToNextPage,
  goToPreviousPage,
  archiveForm,
  archiveForms,
  duplicateForm,
  sendFormLink,
  setFormStatus
} from 'redux/modules/formsList';
import { goTo } from 'redux/modules/router.js';
import { show } from 'redux-modal';

import FormsListView from '../components/FormsListView/FormsListView';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { formsList } = state;
  const {
    isFetchingForms,
    forms,
    totalCount,
    page,
    pageSize,
    selectedStatusFilterOptions,
    sortColumn,
    isSortAscending,
    selectedItems,
    isSendingEmail
  } = formsList || INIT_FORMSLIST_STATE;
  return {
    isFetchingForms,
    forms,
    totalCount,
    page,
    pageSize,
    selectedStatusFilterOptions,
    sortColumn,
    isSortAscending,
    selectedItems,
    isSendingEmail
  };
};

const mapActionCreators = {
  fetchFormsList,
  selectAllItems,
  toggleSelectItem,
  setPageSize,
  filterFormsByStatus,
  goToNextPage,
  goToPreviousPage,
  archiveForm,
  archiveForms,
  duplicateForm,
  sendFormLink,
  setFormStatus,
  goTo,
  showModal: show
};

export default connect(mapStateToProps, mapActionCreators)(FormsListView);
