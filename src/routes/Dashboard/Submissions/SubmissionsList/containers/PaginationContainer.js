import connect from 'redux/utils/connect';
import {
  INIT_SUBMISSIONSLIST_STATE,
  fetchSubmissions
} from 'redux/modules/submissionsList';

import Pagination from 'components/GriddleComponents/Pagination/Pagination';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { submissionsList } = state;
  const {
    pageSize
  } = submissionsList || INIT_SUBMISSIONSLIST_STATE;
  return {
    pageSize
  };
};

const mapActionCreators = {
  fetchSubmissions
};

export default connect(mapStateToProps, mapActionCreators)(Pagination);
