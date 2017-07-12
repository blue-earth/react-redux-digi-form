import connect from 'redux/utils/connect';
import {
  INIT_FORMSLIST_STATE,
  fetchFormsList,
  selectAllItems,
  toggleSelectItem,
  setPageSize,
  next,
  previous
} from 'redux/modules/formsList';
import { goTo } from 'redux/modules/router.js';

import FormsListView from '../components/FormsListView/FormsListView';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { formsList } = state;
  const {
    isFetching,
    forms,
    totalCount,
    page,
    pageSize,
    sortColumn,
    sortAscending,
    selectedItems
  } = formsList || INIT_FORMSLIST_STATE;
  return {
    isFetching,
    forms,
    totalCount,
    page,
    pageSize,
    sortColumn,
    sortAscending,
    selectedItems
  };
};

const mapActionCreators = {
  fetchFormsList,
  selectAllItems,
  toggleSelectItem,
  goTo,
  setPageSize,
  next,
  previous
};

export default connect(mapStateToProps, mapActionCreators)(FormsListView);
