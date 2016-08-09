import React, { Component } from 'react';
import styles from './Spinner.scss';

class Spinner extends Component {
  render() {
    var spinnerPath = require('./emondo_spinner_darkgrey.gif');
    return (
      <img src={spinnerPath} alt="Loading" className={styles.spinner} />
    );
  }
}

export default Spinner;
