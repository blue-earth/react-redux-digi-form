import React, { Component, PropTypes } from 'react';
import StackLogo from 'components/Logos/StackLogo';
import {
  Grid,
  ButtonToolbar
} from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import { FaBell } from 'react-icons/lib/fa';
import styles from './DashboardHeader.scss';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  documentsPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';
import AlertMessage from 'components/AlertMessage';

export default class DashboardHeader extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    location: PropTypes.object,
    goTo: PropTypes.func
  };

  handleNav = (navPath) => {
    const { goTo } = this.props;
    goTo(dashboardUrl(navPath));
  }

  get profileDropdown() {
    return [
      {
        key: submissionsPath,
        eventKey: submissionsPath,
        label: 'Submissions'
      },
      {
        key: formsPath,
        eventKey: formsPath,
        label: 'Forms'
      },
      {
        key: documentsPath,
        eventKey: documentsPath,
        label: 'Documents'
      },
      {
        key: '1',
        divider: true
      },
      {
        key: usersPath,
        eventKey: usersPath,
        label: 'Users'
      },
      {
        key: settingsPath,
        eventKey: settingsPath,
        label: 'Settings'
      }
    ];
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
    const createUrl = require('./create.svg');
    const sendUrl = require('./send.svg');
    const signUrl = require('./sign.svg');
    const starUrl = require('./star.svg');
    const height = 14;
    return (
      <div className={styles.header}>
        <Grid>
          <div className={styles.logo}>
            <StackLogo className={styles.logo} width="auto" height={32} logoStyle="white" />
          </div>
          <ButtonToolbar className={styles.leftToolbar}>
            <Button defaultWidth={76} style="headerButton">
              <img width="auto" height={height} src={createUrl} className={styles.dashboardButton} /> Create
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <img width="auto" height={height} src={signUrl} className={styles.dashboardButton} /> Sign
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <img width="auto" height={height} src={sendUrl} className={styles.dashboardButton} /> Send
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <img width="auto" height={height} src={starUrl} className={styles.dashboardButton} /> Certify
            </Button>
          </ButtonToolbar>
          <ButtonToolbar className={styles.rightToolbar}>
            <Button style="headerButton" iconOnly noCaret pullRight
              dropDown={this.profileDropdown}
              onClick={this.handleNav}
              id="profile-menu"
            >
              <img src="http://localhost:3000/avatar.jpg" alt="" className={styles.profileImage} />
              <span className={styles.profileName}>{'JM'}</span>
            </Button>
            <AlertMessage list={list}>
              <Button style="headerButton" iconOnly notificationCounter={5}>
                <FaBell size={24} />
              </Button>
            </AlertMessage>
          </ButtonToolbar>
        </Grid>
      </div>
    );
  }
}
