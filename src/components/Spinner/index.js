import React, { Component } from 'react';
import styles from './Spinner.scss';
import classNames from 'classnames/bind';

class Spinner extends Component {
  render() {
    var spinnerPath = require('./emondo_spinner_darkgrey.gif');
    return (
      <img src={spinnerPath} alt="Loading" className={classNames.bind(styles)('spinner')} />
    );
  }
}

export default Spinner;
