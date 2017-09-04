import React, {
  Component,
  PropTypes
} from 'react';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import {
  FaCaretDown
} from 'react-icons/lib/fa';
import Icon from 'components/Icon';

import classNames from 'classnames';
import styles from './DropdownSelection.scss';

export default class DropdownSelection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      isMenuOpen: false
    };
  }

  static propTypes = {
    id: PropTypes.number,
    selectedItems: PropTypes.array,
    checked: PropTypes.bool,
    dropdownMenus: PropTypes.array,
    onSelect: PropTypes.func
  }

  onMouseOver = () => {
    this.setState({
      hover: true
    });
  }

  onMouseOut = () => {
    if (!this.state.isMenuOpen) {
      this.setState({
        hover: false
      });
    }
  }

  handleMenuOpen = () => {
    this.setState({
      isMenuOpen: true
    });
  }

  handleMenuClose = () => {
    this.setState({
      isMenuOpen: false,
      hover: false
    });
  }

  handleCheckboxChange = () => {
    const { onSelect } = this.props;
    onSelect();
    this.setState({
      hover: true
    });
  }

  handleMenuClick = (event) => {
    const { dropdownMenus, id, selectedItems } = this.props;
    const menu = dropdownMenus[event.currentTarget.dataset.index];
    if (selectedItems && selectedItems.length > 0) {
      menu.onClick(selectedItems);
    } else {
      menu.onClick(id);
    }
    this.refs.dropdownTrigger.hide();
  }

  render() {
    const { checked, dropdownMenus, id } = this.props;
    const dropdown = (
      <Popover arrowOffsetLeft={124} className="dropdownMenuContent" id={`dropdownmenu-${id}`} placement="bottom">
        <ul className={styles.dropdownMenus}>
          {dropdownMenus.map((menu, index) =>
            <li
              key={index}
              data-index={index}
              className={styles.dropdownMenu}
              onClick={this.handleMenuClick}>
              <div className={styles.actionIconWrapper}>
                <Icon name={menu.icon} height={16} style={{verticalAlign: 'top'}} />
              </div>
              {menu.label}
            </li>)}
        </ul>
      </Popover>);
    return (
      <OverlayTrigger
        rootClose
        ref="dropdownTrigger"
        trigger="click"
        placement="bottom"
        overlay={dropdown}
        onEnter={this.handleMenuOpen}
        onExit={this.handleMenuClose}>
        <div className={classNames(styles.checkBoxWrapper, {[styles.hover]: this.state.hover})}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={this.handleCheckboxChange}
            checked={checked} />
          <FaCaretDown ref="dropdownIcon" size={14} className={styles.dropdownCaret} />
        </div>
      </OverlayTrigger>
    );
  }
}
