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
import {
  dashboardUrl,
  submissionsPath,
  sharingPath,
  alertsPath,
  analyticsPath,
  formsPath,
  documentsPath,
  certificationPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';
import styles from './DashboardTabs.scss';
import _ from 'lodash';

const navItems = [
  {
    path: `${submissionsPath}/1/1398`,
    label: 'Submissions'
  },
  {
    path: sharingPath,
    label: 'Sharing'
  },
  {
    path: alertsPath,
    label: 'Alerts'
  },
  {
    path: analyticsPath,
    label: 'Analytics'
  },
  {
    path: formsPath,
    label: 'Forms'
  },
  {
    path: documentsPath,
    label: 'Documents'
  },
  {
    path: certificationPath,
    label: 'Certification'
  },
  {
    path: usersPath,
    label: 'Users'
  },
  {
    path: settingsPath,
    label: 'Settings'
  }
];

class DashboardTabs extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func
  };

  handleSelect = (navPath) => {
    const { goTo } = this.props;
    goTo(dashboardUrl(navPath));
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
