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
  open = () => {
    this.setState({
      isOpen: true
    });
  }
  close = () => {
    this.setState({
      isOpen: false
    });
  }
  render() {
    const {children, list} = this.props;
    var cx = classNames.bind(styles); // eslint-disable-line
    return (
      <div className={cx('alertMessageSection')} onFocus={this.open} onBlur={this.close}>
        {children}
        <div className={cx('alertBox', {hide: !this.state.isOpen})}>
          <div className={cx('alertWrapper')}>
            <ul className={cx('messageList')}>
              {list.map((alert, index) => (
                <li key={index} className={cx('messageItem')}>
                  <div className={cx('messageContent', {'highlighted': alert.highlight})}>
                    <a href={alert.link} className={cx('messageLink')}>{alert.message}</a>
                  </div>
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
