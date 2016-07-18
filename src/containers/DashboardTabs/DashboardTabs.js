import React, {
  Component,
  PropTypes
} from 'react';
import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap';
import connect from 'redux/utils/connect';
import { goTo } from 'redux/modules/router';
import styles from './DashboardTabs.scss';
import _ from 'lodash';

const basePath = 'dashboard/';
const navItems = [
  {
    path: 'submissions/1/1398',
    label: 'Submissions'
  },
  {
    path: 'sharing',
    label: 'Sharing'
  },
  {
    path: 'alerts',
    label: 'Alerts'
  },
  {
    path: 'analytics',
    label: 'Analytics'
  },
  {
    path: 'builder/new',
    label: 'Forms'
  },
  {
    path: 'documents',
    label: 'Documents'
  },
  {
    path: 'certification',
    label: 'Certification'
  },
  {
    path: 'users',
    label: 'Users'
  },
  {
    path: 'settings',
    label: 'Settings'
  }
];

class DashboardTabs extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func
  };

  handleSelect = (selectedKey) => {
    const { goTo } = this.props;
    goTo(`/${basePath}` + selectedKey);
  }

  getActiveKey() {
    const { location: { pathname } } = this.props;
    const navItem = _.find(navItems, function (o) { return pathname.includes(o.path); });
    return navItem ? navItem.path : undefined;
  }

  render() {
    return (
      <Navbar fluid className={styles.dashboardTabs}>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight onSelect={this.handleSelect} activeKey={this.getActiveKey()}>
            {
              navItems.map((navItem) => {
                return (
                  <NavItem eventKey={navItem.path} className="navItem" href="#">
                    {navItem.label}
                  </NavItem>
                );
              })
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default DashboardTabs;

const mapActionCreators = {
  goTo
};

export default connect(null, mapActionCreators)(DashboardTabs);
