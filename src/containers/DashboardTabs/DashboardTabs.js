import React, {
  Component,
  PropTypes
} from 'react';
import {
  Navbar,
  Nav,
  NavItem
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { goTo } from 'redux/modules/router';
import { bindActionCreators } from 'redux';
import styles from './DashboardTabs.scss';

const basePath = 'dashboard/';

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
    const { location } = this.props;
    let pos;
    if ((pos = location.pathname.indexOf(basePath)) >= 0) {
      pos += basePath.length;
      console.log(location.pathname.substring(pos));
      return location.pathname.substring(pos);
    }
    return undefined;
  }

  render() {
    return (
      <Navbar fluid className={styles.dashboardTabs}>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight onSelect={this.handleSelect} activeKey={this.getActiveKey()}>
            <NavItem eventKey="submissions/1/1398" className="navItem" href="#">Submissions</NavItem>
            <NavItem eventKey="sharing" className="navItem" href="#">Sharing</NavItem>
            <NavItem eventKey="alerts" className="navItem" href="#">Alerts</NavItem>
            <NavItem eventKey="analytics" className="navItem" href="#">Analytics</NavItem>
            <NavItem eventKey="builder/new" className="navItem" href="#">Forms</NavItem>
            <NavItem eventKey="documents" className="navItem" href="#">Documents</NavItem>
            <NavItem eventKey="certification" className="navItem" href="#">Certification</NavItem>
            <NavItem eventKey="users" className="navItem" href="#">Users</NavItem>
            <NavItem eventKey="settings" className="navItem" href="#">Settings</NavItem>
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(mapActionCreators, dispatch);
};

export default connect(null, mapDispatchToProps)(DashboardTabs);
