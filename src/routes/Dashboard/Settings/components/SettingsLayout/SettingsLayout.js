import React, {
  Component,
  PropTypes
} from 'react';
import SettingsNavigationMenu from '../SettingsNavigationMenu/SettingsNavigationMenu';
import classes from './SettingsLayout.scss';
import classNames from 'classnames';

class SettingsLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  };
  static defaultProps = {

  };

  render() {
    return (
      <div className={classes.settingsContainer}>
        <div className={classNames(classes.fullHeightContainer, classes.leftNavContainer)}>
          <SettingsNavigationMenu />
        </div>
        <div className={classNames(classes.fullHeightContainer, classes.childContentsContainer)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SettingsLayout;
