import React, { Component, PropTypes } from 'react';
import styles from './FormEnterButton.scss';


class FormEnterButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button type="button" className={styles.formEnterButton}>
        <div className={styles.btnInner}>
          <div>press</div>
          <div>ENTER</div>
        </div>
      </button>
    )
  }
}

export default FormEnterButton



