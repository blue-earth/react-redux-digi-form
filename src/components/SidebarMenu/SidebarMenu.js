import React, {
  Component,
  PropTypes
} from 'react';
import {
  Nav,
  NavItem
} from 'react-bootstrap';
import styles from './SidebarMenu.scss';

class SidebarMenu extends Component {

  static propTypes = {
    /*
    menuItems: collection
    [{
      label: "Display Text",
      key: <unique identifier, passed to select function>
    }]
    */
    menuItems: PropTypes.array.isRequired,

    /*
    the key of the selected item from menuItems
    */
    selectedItemKey: PropTypes.any,

    onMenuItemSelect: PropTypes.func,

    /*
    disable clicks while something is loading
    */
    isLoadingItem: PropTypes.bool
  }

  handleSelect = (arg) => {
    const { onMenuItemSelect, isLoadingItem } = this.props;
    if (typeof onMenuItemSelect === 'function' && !isLoadingItem) onMenuItemSelect(arg);
  }

  render() {
    return (
      <Nav onSelect={this.handleSelect} activeKey={this.props.selectedItemKey} className={styles.sidebarMenu}>
        {
          this.props.menuItems.map((navItem) => {
            return (
              <NavItem key={navItem.key} eventKey={navItem.key}>
                {navItem.label}
              </NavItem>
            );
          })
        }
      </Nav>
    );
  }
}

export default SidebarMenu;
