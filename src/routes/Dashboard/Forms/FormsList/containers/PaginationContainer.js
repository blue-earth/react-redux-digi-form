import connect from 'redux/utils/connect';
import {
  INIT_FORMSLIST_STATE,
  fetchFormsList
} from 'redux/modules/formsList';

import PaginationComponent from 'components/GriddleComponents/PaginationComponent/PaginationComponent';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { formsList } = state;
  const {
    pageSize
  } = formsList || INIT_FORMSLIST_STATE;
  return {
    pageSize
  };
};

const mapActionCreators = {
  fetchPage: fetchFormsList
};

export default connect(mapStateToProps, mapActionCreators)(PaginationComponent);
