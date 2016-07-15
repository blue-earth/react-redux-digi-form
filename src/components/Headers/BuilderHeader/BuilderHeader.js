import React, { Component } from 'react';
import StackLogo from 'components/Logos/StackLogo';
import { ButtonToolbar } from 'react-bootstrap';
import HeaderButton from 'components/Buttons/HeaderButton/HeaderButton';
import {
  FaHome,
  FaBellO
} from 'react-icons/lib/fa';
import styles from './BuilderHeader.scss';

class BuilderHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <StackLogo className={styles.logo} width="auto" height={32} />
        </div>
        <ButtonToolbar className={styles.leftToolbar}>
          <HeaderButton style="square">
            <FaHome size={16} />
          </HeaderButton>
          <HeaderButton defaultWidth={76}>
            Create
          </HeaderButton>
          <HeaderButton defaultWidth={76}>
            Sign
          </HeaderButton>
          <HeaderButton defaultWidth={76}>
            Send
          </HeaderButton>
          <HeaderButton defaultWidth={76}>
            Certify
          </HeaderButton>
        </ButtonToolbar>
        <ButtonToolbar className={styles.rightToolbar}>
          <HeaderButton style="noPadding" defaultWidth={100}>
            Search
          </HeaderButton>
          <HeaderButton style="noPadding" defaultWidth={100}>
            Dashboard
          </HeaderButton>
          <HeaderButton style="square">
            BD
          </HeaderButton>
          <HeaderButton style="square" notificationCounter={5}>
            <FaBellO size={16} />
          </HeaderButton>
          <HeaderButton style="noPadding">
            <span className={styles.profileName}>{'JM'}</span>
            <img src="http://localhost:3000/avatar.jpg" alt="" />
          </HeaderButton>
        </ButtonToolbar>
      </div>
    );
  }
}

export default BuilderHeader;
