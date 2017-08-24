import React, { Component, PropTypes } from 'react';
import StackLogo from 'components/Logos/StackLogo';
import {
  ButtonToolbar
} from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import {
  FaBell,
  FaPowerOff
} from 'react-icons/lib/fa';
import styles from './DashboardHeader.scss';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';
import AlertMessage from 'components/AlertMessage';
import ProfileMenu from 'components/ProfileMenu';
import DashboardPageInnerLayout from 'layouts/DashboardPageInnerLayout';
import DashboardTabs from 'containers/DashboardTabsContainer';

export default class DashboardHeader extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func,
    processLogout: PropTypes.func,
    user: PropTypes.object.isRequired
  };

  handleNav = (navPath) => {
    const { goTo, processLogout } = this.props;
    if (navPath === 'logout') {
      return processLogout();
    }
    goTo(dashboardUrl(navPath));
  }

  render() {
    const list = [{
      highlight: true,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkfsdfsdfsdfsdfsdf dsf',
      time: '2m ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Lihan Li viewed the Personal Form',
      time: '5m ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Shaun Harvey abandonded the Some thing',
      time: '1h ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }, {
      highlight: false,
      message: 'Jordan McCown completed the SMSF tlksdfn sdkf',
      time: '2h ago',
      link: '/forms/3'
    }];
    const profileMenus = [{
      label: 'Submissions',
      key: submissionsPath,
      url: submissionsPath
    }, {
      label: 'Forms',
      key: formsPath,
      url: formsPath
    }, {
      divider: true,
      key: 1
    }, {
      label: 'Settings',
      key: settingsPath,
      url: settingsPath
    }, {
      label: 'Users',
      key: usersPath,
      url: usersPath
    }, {
      divider: true,
      key: 2
    }, {
      label: (
        <div>Log out{'   '}
          <FaPowerOff size={16} color="#9fa9ba"
            style={{marginLeft: '4px', verticalAlign: 'sub'}} />
        </div>),
      key: 'logout',
      url: 'logout'
    }];
    const { user } = this.props;
    const firstName = user.first_name;
    const lastName = user.last_name;
    return (
      <div className={styles.header}>
        <DashboardPageInnerLayout>
          <div className={styles.logo}>
            <StackLogo className={styles.logo} width="auto" height={31} logoStyle="white" />
          </div>
          <DashboardTabs location={this.props.location} />
          <ButtonToolbar className={styles.rightToolbar}>
            <ProfileMenu list={profileMenus} onClick={this.handleNav}>
              <Button style="headerButton" iconOnly pullRight id="peofile-menu">
                { user.avatar
                  ? (<img src={user.avatar} alt="" className={styles.profileImage} />)
                  : <span className={styles.noAvatar}>
                    {firstName.substring(0, 1)}{lastName.substring(0, 1)}
                  </span>
                }
                <span className={styles.profileName}>{firstName} {lastName}</span>
              </Button>
            </ProfileMenu>
            <AlertMessage list={list}>
              <Button style="headerButton" iconOnly notificationCounter={5}>
                <FaBell size={24} />
              </Button>
            </AlertMessage>
          </ButtonToolbar>
        </DashboardPageInnerLayout>
      </div>
    );
  }
}
