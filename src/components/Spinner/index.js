import React, { Component } from 'react';
import styles from './Spinner.scss';

class Spinner extends Component {

  // static propTypes = {
  //   foreground: PropTypes.string,
  //   background: PropTypes.string
  // }
  //
  // static defaultProps = {
  //   foreground: 'blue',
  //   background: 'white'
  // };

  render() {
    // var colours = this.props.foreground + '_' + this.props.background;
    // var spinnerPath = require('./emondo_spinner_' + colours + '.gif');
    // return (
    //   <img src={spinnerPath} alt="Loading" className={styles.spinner} />
    // );
    return (
      <span className={styles.spinnerWrapperOuter}>
        <span className={styles.spinnerWrapperInner}>
          <span className="sr-only">loading</span>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve"
            className={styles.spinner}>
            <path className={styles.spinnerCircle}
              d="M68.4,34.4l-3.7,1.4c3.6,3.7,5.8,8.7,5.8,14.2c0,11.3-9.2,20.4-20.4,20.4c-11.3,0-20.4-9.2-20.4-20.4
    S38.7,29.6,50,29.6c2.8,0,5.5,0.6,7.9,1.6l2.7-2.8c-3.2-1.6-6.8-2.5-10.6-2.5c-13.3,0-24.1,10.8-24.1,24.1
    c0,13.3,10.8,24.1,24.1,24.1c13.3,0,24.1-10.8,24.1-24.1C74.1,44,72,38.6,68.4,34.4z" />
            <path className="spinnerFeather"
              d="M81.2,21.8c0,0,9,4.5,14.9-3.6c-1,0.9-6.2,1.9-8.5,0.7c0,0,6.1-0.5,9.6-4.3c2.2-2.4,2.4-4.9,2.4-4.9
    S74.5,10.3,58,29c-5.6,6.3-8.7,12.5-9.2,18.8c-0.3,4.7,1.9,7.6,1.9,7.6S47.5,35.7,73.9,31c-2.2-0.5-4.8-2.1-5.1-3.1
    c9.8,4.1,19.4-0.3,22-3.1C89.2,25.2,82.6,24.1,81.2,21.8z" />
          </svg>
        </span>
      </span>
    );
  }
}

export default Spinner;
