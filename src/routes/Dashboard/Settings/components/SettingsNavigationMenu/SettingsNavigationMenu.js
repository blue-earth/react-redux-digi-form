import React, {
  Component
} from 'react';
import { Link } from 'react-router';
import { settingsUrl } from 'helpers/urlHelper';
import { FaUser, FaBell, FaLock, FaColumns, FaPencil, FaMoney, FaCoffee } from 'react-icons/lib/fa';
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
        url: settingsUrl('notifications'),
        text: 'Notifications',
        icon: <FaBell />
      },
      {
        url: settingsUrl('custom-branding'),
        text: 'Custom branding & themes',
        icon: <FaCoffee />
      },
      {
        url: settingsUrl('security'),
        text: 'Security',
        icon: <FaLock />
      },
      {
        url: settingsUrl('billing'),
        text: 'My plan & billing',
        icon: <FaMoney />
      },
      {
        url: settingsUrl('signature'),
        text: 'My signature',
        icon: <FaPencil />
      },
      {
        url: settingsUrl('custom-columns'),
        text: 'Custome columns',
        icon: <FaColumns />
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
