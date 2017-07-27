import React, {
  Component
} from 'react';
import { Link } from 'react-router';
import { settingsUrl } from 'helpers/urlHelper';
import { FaUser, FaMoney } from 'react-icons/lib/fa';
import classes from './SettingsNavigationMenu.scss';

class SettingsNavigationMenu extends Component {
  get settingMenuItems() {
    return [
      {
        url: settingsUrl('profile'),
        text: 'Profile',
        icon: <FaUser />
      },
      {
        url: settingsUrl('billing'),
        text: 'My plan & billing',
        icon: <FaMoney />
      }
    ];
  }

  renderSettingMenuItems = () => {
    return this.settingMenuItems.map(menuItem => (
      <li className={classes.menuListItem} key={menuItem.url}>
        <Link
          className={classes.menuListItem}
          activeClassName={classes.menuListItemActive}
          to={menuItem.url}>
          {menuItem.icon}
          <span>{menuItem.text}</span>
        </Link>
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
    );
  }
}

export default SettingsNavigationMenu;
