import React, { Component, PropTypes } from 'react';
import classes from './BuilderHeader.scss';
import StackLogo from 'components/Logos/StackLogo';
import HeaderButton from 'components/Buttons/HeaderButton/HeaderButton';

class BuilderHeader extends Component {

  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    
  }

  render() {
    const { submitAnswer } = this.props;

    return (
      <div className={classes.header}>
        <div className={classes.logo}>
          <StackLogo className={classes.logo}/>
        </div>
        <div className={classes.buttonarea}>
          <HeaderButton buttonLabel = 'H'/>
          <HeaderButton buttonLabel = 'Create'/>
          <HeaderButton buttonLabel = 'Sign'/>
        </div>
      </div>
    );
  }
}

export default BuilderHeader;
