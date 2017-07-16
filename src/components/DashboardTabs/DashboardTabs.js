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
        icon: <MdHome size={16} style={{'verticalAlign': 'text-top', marginRight: '5px'}} />,
        position: 'left'
      },
      {
        path: formsPath,
        label: 'Forms',
        position: 'left'
      },
      {
        path: settingsPath,
        label: 'Settings',
        position: 'right'
      },
      {
        path: usersPath,
        label: 'Users',
        position: 'right'
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
      <Navbar className={styles.dashboardTabs}>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className={styles.dashboardTabsWrapper}>
          <Nav onSelect={this.handleSelect} activeKey={this.getActiveKey()}>
            {
              this.navItems.filter(navItem => navItem.position === 'left').map((navItem) => {
                return (
                  <NavItem key={navItem.path} eventKey={navItem.path} className="navItem">
                    {navItem.icon} {navItem.label}
                  </NavItem>
                );
              })
            }
          </Nav>
          <Nav pullRight onSelect={this.handleSelect} activeKey={this.getActiveKey()}>
            {
              this.navItems.filter(navItem => navItem.position === 'right').map((navItem) => {
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
