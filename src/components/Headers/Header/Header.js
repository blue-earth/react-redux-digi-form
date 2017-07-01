import React from 'react';
import { Grid } from 'react-bootstrap';
import StackLogo from 'components/Logos/StackLogo';
import styles from './Header.scss';

export const Header = () => (
  <div className={styles.header}>
    <Grid fluid>
      <StackLogo className={styles.logo} width="auto" height={38} logoStyle="white" />
    </Grid>
  </div>
);

export default Header;
