import React, { Component, PropTypes } from 'react';
import StackLogo from 'components/Logos/StackLogo';
import { Grid, ButtonToolbar } from 'react-bootstrap';
import Button from 'components/Buttons/DashboardButtons/Button';
import { FaBell, FaEdit, FaPencil, FaPaperPlane, FaStar } from 'react-icons/lib/fa';
import styles from './DashboardHeader.scss';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  documentsPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';

export default class DashboardHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
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
    return (
      <div className={styles.header}>
        <Grid fluid>
          <div className={styles.logo}>
            <StackLogo className={styles.logo} width="auto" height={38} logoStyle="white" />
          </div>
          <ButtonToolbar className={styles.leftToolbar}>
            <Button defaultWidth={76} style="headerButton">
              <FaEdit /> Create
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <FaPencil /> Sign
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <FaPaperPlane /> Send
            </Button>
            <Button defaultWidth={76} style="headerButton">
              <FaStar /> Certify
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
            <Button style="headerButton" iconOnly notificationCounter={5}>
              <FaBell size={24} />
            </Button>
          </ButtonToolbar>
        </Grid>
      </div>
    );
  }
}
