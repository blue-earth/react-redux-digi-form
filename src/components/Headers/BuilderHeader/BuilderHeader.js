import React, { Component } from 'react';
import StackLogo from 'components/Logos/StackLogo';
import { Grid, ButtonToolbar } from 'react-bootstrap';
import HeaderButton from 'components/Buttons/HeaderButton/HeaderButton';
import { FaBellO } from 'react-icons/lib/fa';
import styles from './BuilderHeader.scss';

class BuilderHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  render() {
    return (
      <div className={styles.header}>
        <Grid fluid>
          <div className={styles.logo}>
            <StackLogo className={styles.logo} width="auto" height={32} logoStyle="darkgrey" />
          </div>
          <ButtonToolbar className={styles.leftToolbar}>
            <HeaderButton defaultWidth={76} bsIcon="plus">
              Create
            </HeaderButton>
            <HeaderButton defaultWidth={76} bsIcon="pencil">
              Sign
            </HeaderButton>
            <HeaderButton defaultWidth={76} bsIcon="send">
              Send
            </HeaderButton>
            <HeaderButton defaultWidth={76} bsIcon="thumbs-up">
              Certify
            </HeaderButton>
          </ButtonToolbar>
          <ButtonToolbar className={styles.rightToolbar}>
            <HeaderButton style="iconOnly">
              <img src="http://localhost:3000/avatar.jpg" alt="" className={styles.profileImage} />
              <span className={styles.profileName}>{'JM'}</span>
            </HeaderButton>
            <HeaderButton style="iconOnly" notificationCounter={5}>
              <FaBellO size={24} />
            </HeaderButton>
          </ButtonToolbar>
        </Grid>
      </div>
    );
  }
}

export default BuilderHeader;
