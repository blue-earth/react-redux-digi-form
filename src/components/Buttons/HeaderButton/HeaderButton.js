import React, {
  Component,
  PropTypes
} from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './HeaderButton.scss';

class HeaderButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    children: PropTypes.node,
    notificationCounter: PropTypes.number,
    style: PropTypes.oneOf(['normal', 'square', 'noPadding']),
    defaultWidth: PropTypes.number
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
      [styles.noPaddingButton]: style === 'noPadding'
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

  render() {
    const { children } = this.props;

    return (
      <Button type="button" onClick={this.handleClick}
        className={this.getWrapperClass()}
        {...this.getOptionalParams()}
      >
        {this.renderNotificationCounter()}
        {children}
      </Button>
    );
  }
}

export default HeaderButton;
