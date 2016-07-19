import connect from 'redux/utils/connect';
import {
  INIT_FORMSLIST_STATE,
  fetchFormsList
} from 'redux/modules/formsList';

import FormListView from '../components/FormListView';

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapStateToProps = (state) => {
  const { formsList } = state;
  const {
    forms,
    isFetching
  } = formsList || INIT_FORMSLIST_STATE;
  return {
    forms,
    isFetching
  };
};

const mapActionCreators = {
  fetchFormsList
};

export default connect(mapStateToProps, mapActionCreators)(FormListView);
