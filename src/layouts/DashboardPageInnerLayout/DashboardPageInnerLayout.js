import styles from './DashboardPageInnerLayout.scss';
import React, {PropTypes} from 'react';

const DashboardPageInnerLayout = ({children, extraStyle}) => (
  <div className={styles.DashboardPageInner} style={extraStyle}>
    {children}
  </div>
);

DashboardPageInnerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  extraStyle: PropTypes.object
};

DashboardPageInnerLayout.defaultValue = {
  extraStyle: {}
};

export default DashboardPageInnerLayout;
