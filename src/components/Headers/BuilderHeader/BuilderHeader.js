import React, { Component, PropTypes } from 'react';
import connect from 'redux/utils/connect';
import StackLogo from 'components/Logos/StackLogo';
import { Grid, ButtonToolbar } from 'react-bootstrap';
import HeaderButton from 'components/Buttons/DashButtons/HeaderButton';
import { FaBell, FaEdit, FaPencil, FaPaperPlane, FaStar } from 'react-icons/lib/fa';
import styles from './BuilderHeader.scss';
import { goTo } from 'redux/modules/router';
import {
  dashboardUrl,
  submissionsPath,
  formsPath,
  documentsPath,
  usersPath,
  settingsPath
} from 'helpers/urlHelper';

class BuilderHeader extends Component {

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
            <HeaderButton defaultWidth={76} style="headerButton">
              <FaEdit /> Create
            </HeaderButton>
            <HeaderButton defaultWidth={76} style="headerButton">
              <FaPencil /> Sign
            </HeaderButton>
            <HeaderButton defaultWidth={76} style="headerButton">
              <FaPaperPlane /> Send
            </HeaderButton>
            <HeaderButton defaultWidth={76} style="headerButton">
              <FaStar /> Certify
            </HeaderButton>
          </ButtonToolbar>
          <ButtonToolbar className={styles.rightToolbar}>
            <HeaderButton style="headerButton" iconOnly noCaret pullRight
              dropDown={this.profileDropdown}
              onClick={this.handleNav}
              id="profile-menu"
            >
              <img src="http://localhost:3000/avatar.jpg" alt="" className={styles.profileImage} />
              <span className={styles.profileName}>{'JM'}</span>
            </HeaderButton>
            <HeaderButton style="headerButton" iconOnly notificationCounter={5}>
              <FaBell size={24} />
            </HeaderButton>
          </ButtonToolbar>
        </Grid>
      </div>
    );
  }
}

export default BuilderHeader;

const mapActionCreators = {
  goTo
};

export default connect(null, mapActionCreators)(BuilderHeader);
