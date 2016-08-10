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

class DashboardTabs extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func
  };

  handleSelect = (navPath) => {
    const { goTo } = this.props;
    goTo(dashboardUrl(navPath));
  }

  get navItems() {
    return [
      {
        path: submissionsPath,
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
  }

  getActiveKey() {
    const { location: { pathname } } = this.props;
    const navItem = _.find(this.navItems, function (o) { return pathname.includes(o.path); });
    return navItem ? navItem.path : undefined;
  }

  render() {
    return (
      <Navbar fluid className={styles.dashboardTabs}>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav onSelect={this.handleSelect} activeKey={this.getActiveKey()}>
            {
              this.navItems.map((navItem) => {
                return (
                  <NavItem key={navItem.path} eventKey={navItem.path} className="navItem">
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
