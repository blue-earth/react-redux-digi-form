import React, {
  Component,
  PropTypes
} from 'react';
import {
  Nav,
  NavItem
} from 'react-bootstrap';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  usersPath
} from 'helpers/urlHelper';
import styles from './DashboardTabs.scss';
import _ from 'lodash';

class DashboardTabs extends Component {

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.getActiveKey()
    };
  }

  componentWillReceiveProps(newProps) {
    const { location: { pathname } } = newProps;
    const navItem = _.find(this.navItems, function (o) { return pathname.includes(o.path); });
    var newKey = navItem ? navItem.path : undefined;
    this.setState({
      activeKey: newKey
    });
  }

  handleSelect = (navPath) => {
    event.preventDefault();
    this.setState({
      activeKey: navPath
    });
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
        label: 'Submissions'
      },
      {
        path: formsPath,
        label: 'Forms'
      },
      {
        path: usersPath,
        label: 'Users'
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
      <Nav className={styles.dashboardTabs} onSelect={this.handleSelect} activeKey={this.state.activeKey}>
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
    );
  }
}

export default DashboardTabs;
