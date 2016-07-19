import React, {
  Component
} from 'react';
import { Link } from 'react-router';
import { settingsUrl } from 'helpers/urlHelper';
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

  get settingMenuItems() {
    return [
      {
        url: settingsUrl('profile'),
        text: 'Profile'
      },
      {
        url: settingsUrl('notifications'),
        text: 'Notifications'
      },
      {
        url: settingsUrl('custom-branding'),
        text: 'Custom branding'
      },
      {
        url: settingsUrl('billing'),
        text: 'My plan & billing'
      },
      {
        url: settingsUrl('security'),
        text: 'Security'
      }
    ];
  }

  renderSettingMenuItems() {
    return this.settingMenuItems.map(menuItem => (
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
    );
  }
}

export default SettingsNavigationMenu;
