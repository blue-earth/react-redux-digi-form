import React, {
  Component,
  PropTypes
} from 'react';
import styles from './StatusText.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class StatusText extends Component {

  static propTypes = {
    status: PropTypes.string
  };

  render() {
    const { status } = this.props;
    const statusClass = status.toLowerCase().replace(/ /g, '');
    return (
      <div className={cx('submissionStatusWrapper', statusClass)}>
        <span className={cx('statusIcon')} />
        {status}
      </div>
    );
  }
}

export default StatusText;
