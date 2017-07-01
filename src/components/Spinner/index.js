import React, { Component } from 'react';
import styles from './Spinner.scss';
import classNames from 'classnames/bind';

class Spinner extends Component {
  render() {
    const spinnerPath = require('./emondo_spinner_darkgrey.gif');
    const cx = classNames.bind(styles); // eslint-disable-line
    return (
      <img src={spinnerPath} alt="Loading" className={cx('spinner')} />
    );
  }
}

export default Spinner;
