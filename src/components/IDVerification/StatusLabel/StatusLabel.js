import React, { Component, PropTypes } from 'react';
import { MdInfo, MdCheckCircle } from 'react-icons/lib/md';
import styles from './StatusLabel.scss';

export default class StatusLabel extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired
  };

  renderStatusSuccess() {
    return (
      <span>
        <MdCheckCircle className={styles.successIcon} size={18} />
        <span className={styles.statusText}>Verified</span>
      </span>
    );
  }

  renderStatusWarning() {
    return (
      <span>
        <MdInfo className={styles.warningIcon} size={18} />
        <span className={styles.statusText}>Pending</span>
      </span>
    );
  }

  render() {
    const { status } = this.props;
    return status === 'PENDING'
      ? this.renderStatusWarning()
      : this.renderStatusSuccess();
  }
}
