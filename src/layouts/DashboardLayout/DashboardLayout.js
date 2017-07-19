import React, {
  Component,
  PropTypes
} from 'react';
import DashboardHeader from 'containers/Headers/DashboardHeaderContainer';
// import DashboardTabs from 'containers/DashboardTabsContainer';
import DashboardSubHeader from 'components/Headers/DashboardSubHeader';
import styles from './DashboardLayout.scss';
import DashboardPageInnerLayout from 'layouts/DashboardPageInnerLayout';

const innerWrapperStyle = {
  'position': 'absolute',
  'top': 0,
  'left': 0,
  'right': 0,
  'bottom': 0
};

class DashboardLayout extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object
  };
  render() {
    const {
      children,
      location
    } = this.props;
    return (
      <div className={styles.dashboard}>
        <DashboardHeader />
        <DashboardSubHeader location={location} />
        <div className={styles.contentWrapper}>
          <DashboardPageInnerLayout extraStyle={innerWrapperStyle}>
            {children}
          </DashboardPageInnerLayout>
        </div>
      </div>
    );
  }
}

export default DashboardLayout;
