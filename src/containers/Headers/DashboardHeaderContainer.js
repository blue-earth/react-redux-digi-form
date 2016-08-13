import { goTo } from 'redux/modules/router';
import DashboardHeader from 'components/Headers/DashboardHeader';
import connect from 'redux/utils/connect';

const mapActionCreators = {
  goTo
};

export default connect(null, mapActionCreators)(DashboardHeader);
