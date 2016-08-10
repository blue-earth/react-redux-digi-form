import React, {
  Component,
  PropTypes
} from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './HeaderButton.scss';
import Spinner from 'components/Spinner';

class HeaderButton extends Component {
  static propTypes = {

    // click function
    onClick: PropTypes.func,

    // disables the button if true
    isDisabled: PropTypes.bool,

    // text and any additional stuff such as profile image
    children: PropTypes.node,

    // adds a counter
    notificationCounter: PropTypes.number,

    style: PropTypes.oneOf(['normal', 'square', 'noPadding', 'iconOnly']),

    // adds css min-width in pixels
    defaultWidth: PropTypes.number,

    // adds a bootstrap glyphicon, eg. bsIcon="star"
    bsIcon: PropTypes.string,

    // adds an animated spinner icon. overrides bsIcon.
    showSpinner: PropTypes.bool
  };

  static defaultProps = {
    style: 'normal'
  };

  handleClick = () => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') onClick();
  }

  getWrapperClass() {
    const { style } = this.props;
    return classNames({
      [styles.headerButton]: true,
      [styles.squareButton]: style === 'square',
      [styles.noPaddingButton]: style === 'noPadding',
      [styles.iconOnly]: style === 'iconOnly'
    });
  }

  getOptionalParams() {
    const { isDisabled, defaultWidth } = this.props;
    var optionals = {};
    if (isDisabled) {
      optionals['disabled'] = true;
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

  // add an icon to the button
  renderIcon() {
    const { bsIcon, showSpinner } = this.props;
    if (showSpinner === true) {
      return (
        <Spinner />
      );
    } else if (typeof bsIcon !== 'undefined') {
      return (
        <Glyphicon glyph={bsIcon} />
      );
    } else {
      return false;
    }
  }

  // add a space if there is an icon and text
  renderSpace() {
    const { children, bsIcon, showSpinner } = this.props;
    if (typeof children !== 'undefined') {
      if (typeof bsIcon !== 'undefined' || showSpinner === true) {
        return (
          <span className="iconSpacer">{' '}</span>
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Button type="button" onClick={this.handleClick}
        className={this.getWrapperClass()}
        {...this.getOptionalParams()}
      >
        {this.renderNotificationCounter()}
        {children}
        {this.renderSpace()}
        {this.renderIcon()}
      </Button>
    );
  }
}

export default HeaderButton;
