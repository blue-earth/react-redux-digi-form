import React, { Component, PropTypes } from 'react'
import styles from './Verifier.scss'

class Verifier extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    primaryColor: PropTypes.string
  };

  renderEmondoEmailFieldService() {
    return (
      <span>This email is unavailable.</span>
    )
  }

  render() {
    var { type, status, verification, primaryColor } = this.props
    var output = false
    var validatorStyle = {
      backgroundColor: primaryColor
    }

    if (status === false) {
      switch (type) {
        case 'EmondoEmailFieldService':
          output = this.renderEmondoEmailFieldService()
          break
      }

      return (
        <div className={styles.errorField} style={validatorStyle}>
          {output}
        </div>
      )
    } else {
      return false;
    }
  }
}

export default Verifier