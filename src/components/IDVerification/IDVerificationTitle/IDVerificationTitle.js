import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import styles from './IDVerificationTitle.scss';

export default class IDVerificationTitle extends Component {
  static propTypes = {
    align: PropTypes.oneOf([
      'left', 'right', 'center'
    ]),
    notice: PropTypes.string
  };

  static defaultProps = {
    align: 'left',
    notice: ''
  }

  render() {
    const { notice, align } = this.props;
    const wrapperClass = classNames(styles.wrapper, styles[align]);
    return (
      <div className={wrapperClass}>
        <h2 className={styles.title}>
          Identity Verification
        </h2>
        <div className={styles.notice}>
          {notice}
        </div>
      </div>
    );
  }
}
