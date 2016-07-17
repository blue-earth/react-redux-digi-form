import React, {
  Component,
  PropTypes
} from 'react';
import { Link } from 'react-router'
import classes from './SettingsNavigationMenu.scss';

class SettingsNavigationMenu extends Component {
  static propTypes = {

  };
  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.renderSettingMenuItems = this.renderSettingMenuItems.bind(this);
  }

  getSettingMenuItems() {
    return [
      {
        url: '/dashboard/settings/profile',
        text: 'Profile'
      },
      {
        url: '/dashboard/settings/notifications',
        text: 'Notifications'
      },
      {
        url: '/dashboard/settings/custom-branding',
        text: 'Custom branding'
      },
      {
        url: '/dashboard/settings/billing',
        text: 'My plan & billing'
      },
      {
        url: '/dashboard/settings/security',
        text: 'Security'
      }
    ]
  }

  renderSettingMenuItems() {
    return this.getSettingMenuItems().map(menuItem => (
        <li className={classes.menuListItem} key={menuItem.url}>
          <Link
            style={{'color': 'black'}}
            className={classes.menuListItem}
            activeClassName={classes.menuListItemAcitve}
            to={menuItem.url}>{menuItem.text}</Link>
        </li>
      ));
  }

  render() {
    return (
      <nav className={classes.settingsNavMenu}>
        <ul className={classes.menuList}>
          {this.renderSettingMenuItems()}
        </ul>
      </nav>
    )
  }
}

export default SettingsNavigationMenu;