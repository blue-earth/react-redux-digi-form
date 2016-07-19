import connect from 'redux/utils/connect';
import {
  INIT_SUBMISSIONSLIST_STATE,
  fetchSubmissions
} from 'redux/modules/submissionsList';

import SubmissionsListView from '../components/SubmissionsListView';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { submissionsList } = state;
  const {
    submissions
  } = submissionsList || INIT_SUBMISSIONSLIST_STATE;
  return {
    submissions
  };
};

const mapActionCreators = {
  fetchSubmissions
};

export default connect(mapStateToProps, mapActionCreators)(SubmissionsListView);
