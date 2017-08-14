import React, {
  Component,
  PropTypes
} from 'react';
import styles from './SubmissionStatus.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class SubmissionStatus extends Component {

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

export default SubmissionStatus;
