import React, {
  Component,
  PropTypes
} from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './HeaderButton.scss';
import Spinner from 'components/Spinner';

class HeaderButton extends Component {
  static propTypes = {

    // click function, currently only takes 1 argument
    onClick: PropTypes.func,

    // disables the button if true
    isDisabled: PropTypes.bool,

    // disables the button and adds a spinner icon
    isLoading: PropTypes.bool,

    // text and any additional stuff such as profile image
    children: PropTypes.node,

    // adds a counter
    notificationCounter: PropTypes.number,

    // button style.
    style: PropTypes.oneOf(['headerButton', 'formButton', 'defaultButton']),

    // removes background and border
    iconOnly: PropTypes.bool,

    // adds css min-width in pixels
    defaultWidth: PropTypes.number,

    // array of object with elements path, label, divider
    // divider should not have a label
    // will make this component render as a DropdownButton
    dropDown: PropTypes.array,

    // html id attribute.
    // this is required for dropdowns or it will throw an error
    id: PropTypes.string,

    // removes the caret from dropdown button
    noCaret: PropTypes.bool
  };

  static defaultProps = {
    style: 'defaultButton',
    id: 'id'
  };

  handleClick = (arg) => {
    const { onClick, isLoading } = this.props;
    if (typeof onClick === 'function' && !isLoading) onClick(arg);
  }

  getWrapperClass() {
    const { style, iconOnly, isLoading } = this.props;
    return classNames({
      [styles.headerButton]: style === 'headerButton',
      [styles.formButton]: style === 'formButton',
      [styles.defaultButton]: style === 'defaultButton',
      [styles.iconOnly]: iconOnly === true,
      [styles.loading]: isLoading === true
    });
  }

  getOptionalParams() {
    const { isDisabled, defaultWidth, noCaret, dropDown } = this.props;
    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = true;
    }
    if (noCaret && dropDown) {
      optionals['noCaret'] = true;
    }
    if (defaultWidth) {
      optionals['style'] = { minWidth: defaultWidth };
    }
    return optionals;
  }

  renderNotificationCounter() {
    const { notificationCounter } = this.props;
    if (typeof notificationCounter !== 'undefined') {
      return (
        <span className={styles.notificationCounter}>
          {notificationCounter}
        </span>
      );
    } else {
      return false;
    }
  }

  // add a spinner to the button
  renderSpinner() {
    const { isLoading } = this.props;
    if (isLoading === true) {
      return (
        <Spinner />
      );
    } else {
      return false;
    }
  }

  render() {
    const { children, dropDown, id } = this.props;
    if (typeof dropDown !== 'undefined') {
      let title = <span>{this.renderNotificationCounter()} {children}</span>;
      return (
        <DropdownButton title={title} id={id}
          className={this.getWrapperClass()}
          {...this.getOptionalParams()}
        >
          {
            dropDown.map((navItem) => {
              return (
                <MenuItem key={navItem.path} eventKey={navItem.path}
                  onSelect={this.handleClick} divider={navItem.divider}
                >
                  {navItem.label}
                </MenuItem>
              );
            })
          }
        </DropdownButton>
      );
    } else {
      return (
        <Button type="button" onClick={this.handleClick}
          className={this.getWrapperClass()}
          {...this.getOptionalParams()}
        >
          {this.renderNotificationCounter()}
          {this.renderSpinner()}
          {children}
        </Button>
      );
    }
  }
}

export default HeaderButton;
