import { goTo } from 'redux/modules/router';
import connect from 'redux/utils/connect';
import DashboardTabs from 'components/DashboardTabs';

const mapActionCreators = {
  goTo
};

export default connect(null, mapActionCreators)(DashboardTabs);
