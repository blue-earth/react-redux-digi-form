import { goTo } from 'redux/modules/router';
import { processLogout } from 'redux/modules/auth';
import DashboardHeader from 'components/Headers/DashboardHeader';
import connect from 'redux/utils/connect';

const mapActionCreators = {
  goTo,
  processLogout
};

export default connect(null, mapActionCreators)(DashboardHeader);
