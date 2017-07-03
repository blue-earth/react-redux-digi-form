import React, {
  Component,
  PropTypes
} from 'react';
import styles from './AlertDropdown.scss';
import classNames from 'classnames/bind';

class AlertDropdown extends Component {
  render() {
    const {list} = this.props;
    var cx = classNames.bind(styles);
    return (
      <div className={cx('alertWrapper')}>
        <ul className={cx('messageList')}>
          {list.map((alert, index) => (
            <li key={index} className={cx('messageItem')}>
              <div className={cx('messageContent', {'unreadMessage': !alert.isRead})}>{alert.message}</div>
              <div className={cx('messageTime')}>{alert.time}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default AlertDropdown;
