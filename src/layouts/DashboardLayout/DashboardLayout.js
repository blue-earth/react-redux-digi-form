import React, {
  Component,
  PropTypes
} from 'react';
import { Grid } from 'react-bootstrap';
import DashboardHeader from 'containers/Headers/DashboardHeaderContainer';
import DashboardTabs from 'containers/DashboardTabsContainer';
import styles from './DashboardLayout.scss';

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
        <DashboardTabs location={location} />
        <Grid className={styles.contentWrapper}>
          {children}
        </Grid>
      </div>
    );
  }
}

export default DashboardLayout;
