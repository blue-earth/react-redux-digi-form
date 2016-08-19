import React, { Component, PropTypes } from 'react';
import styles from './Spinner.scss';

class Spinner extends Component {

  static propTypes = {
    foreground: PropTypes.string,
    background: PropTypes.string
  }

  static defaultProps = {
    foreground: 'blue',
    background: 'white'
  };

  /*
  filenames for spinners are in the format emondo_spinner_[foreground]_[background].gif
  */

  render() {
    var colours = this.props.foreground + '_' + this.props.background;
    var spinnerPath = require('./emondo_spinner_' + colours + '.gif');
    return (
      <img src={spinnerPath} alt="Loading" className={styles.spinner} />
    );
  }
}

export default Spinner;
