import React, {
  Component,
  PropTypes
} from 'react';
import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  documentsPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';
import styles from './DashboardTabs.scss';
import { MdHome } from 'react-icons/lib/md';
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

  onClickHome = () => {
    const { goTo } = this.props;
    goTo(dashboardUrl(submissionsPath));
  }

  get navItems() {
    return [
      {
        path: submissionsPath,
        label: 'Submissions',
        icon: <MdHome size={16} style={{'verticalAlign': 'text-top'}} />
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
                    {navItem.icon} {navItem.label}
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
