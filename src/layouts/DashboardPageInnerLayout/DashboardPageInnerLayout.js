import styles from './DashboardPageInnerLayout.scss';
import React, {PropTypes} from 'react';

const DashboardPageInnerLayout = ({children}) => (
  <div className={styles.DashboardPageInner}>
    {children}
  </div>
);

DashboardPageInnerLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardPageInnerLayout;
