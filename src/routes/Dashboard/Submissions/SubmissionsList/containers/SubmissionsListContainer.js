import connect from 'redux/utils/connect';
import {
  INIT_SUBMISSIONSLIST_STATE,
  fetchSubmissions,
  selectAllItems,
  selectAnalyticsPeriod,
  toggleSelectItem,
  setPageSize,
  goToNextPage,
  goToPreviousPage,
  filterSubmissionsByStatus,
  fetchCompanyUsers,
  setAssignee
} from 'redux/modules/submissionsList';
import { goTo } from 'redux/modules/router.js';
import { show } from 'redux-modal';
import SubmissionsListView from '../components/SubmissionsListView';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { submissionsList } = state;
  const {
    isFetching,
    submissions,
    totalCount,
    page,
    pageSize,
    sortColumn,
    sortAscending,
    selectedStatusFilterOptions,
    selectedItems,
    companyUsers,
    analyticsPeriod,
    analytics,
    activities,
    environmentalSavings
  } = submissionsList || INIT_SUBMISSIONSLIST_STATE;
  const { auth } = state;
  const {
    user
  } = auth;
  return {
    isFetching,
    submissions,
    totalCount,
    page,
    pageSize,
    sortColumn,
    sortAscending,
    selectedStatusFilterOptions,
    selectedItems,
    companyUsers,
    analyticsPeriod,
    analytics,
    activities,
    environmentalSavings,
    user
  };
};

const mapActionCreators = {
  fetchSubmissions,
  selectAllItems,
  toggleSelectItem,
  selectAnalyticsPeriod,
  setPageSize,
  goToNextPage,
  goToPreviousPage,
  filterSubmissionsByStatus,
  setAssignee,
  fetchCompanyUsers,
  goTo,
  showModal: show
};

export default connect(mapStateToProps, mapActionCreators)(SubmissionsListView);
