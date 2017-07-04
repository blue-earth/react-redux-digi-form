import React, {
  Component,
  PropTypes
} from 'react';
import styles from './AlertMessage.scss';
import classNames from 'classnames/bind';

class AlertMessage extends Component {
  static propTypes = {
    children: PropTypes.node,
    list: PropTypes.array
  }
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const {children, list} = this.props;
    var cx = classNames.bind(styles);
    return (
      <div className={cx('alertMessageSection')} onClick={this.handleClick}>
        {children}
        <div className={cx('alertBox', {hide: !this.state.isOpen})}>
          <div className={cx('alertWrapper')}>
            <ul className={cx('messageList')}>
              {list.map((alert, index) => (
                <li key={index} className={cx('messageItem')}>
                  <div className={cx('messageContent', {'highlighted': alert.highlight})}>{alert.message}</div>
                  <div className={cx('messageTime')}>{alert.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default AlertMessage;
