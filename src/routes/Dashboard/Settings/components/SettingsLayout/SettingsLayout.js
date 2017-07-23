import React, {
  Component,
  PropTypes
} from 'react';
import SettingsNavigationMenu from '../SettingsNavigationMenu/SettingsNavigationMenu';
import styles from './SettingsLayout.scss';
import {
  Row,
  Col
} from 'react-bootstrap';

class SettingsLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <Row className={styles.settingsContainer}>
        <Col sm={4} xs={12} className={styles.sideNavContainer}>
          <SettingsNavigationMenu />
        </Col>
        <Col sm={8} xs={12} className={styles.childContentsContainer}>
          {this.props.children}
        </Col>
      </Row>
    );
  }
}

export default SettingsLayout;
