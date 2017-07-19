import styles from './DashboardPageLayout.scss';
import React, {PropTypes} from 'react';

const DashboardPageInnerLayout = ({children}) => (
  <div className={styles.DashboardPageInner}>
    {children}
  </div>
);

DashboardPageInnerLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default DashboardPageInnerLayout;
