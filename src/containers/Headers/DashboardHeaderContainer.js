import { goTo } from 'redux/modules/router';
import {
  INIT_AUTH_STATE,
  processLogout
} from 'redux/modules/auth';
import DashboardHeader from 'components/Headers/DashboardHeader';
import connect from 'redux/utils/connect';

const mapActionCreators = {
  goTo,
  processLogout
};

const mapStateToProps = (state) => {
  const { auth } = state;
  const {
    user
  } = auth || INIT_BUILDER_STATE;
  return {
    user
  };
};

export default connect(mapStateToProps, mapActionCreators)(DashboardHeader);
