import React, { Component, PropTypes } from 'react';
import styles from './Verifier.scss';

class Verifier extends Component {
  static contextTypes = {
    primaryColor: React.PropTypes.string
  };

  static propTypes = {
    type: PropTypes.string.isRequired
  };

  renderEmondoEmailFieldService() {
    return (
      <span>This email is unavailable.</span>
    );
  }

  renderAccessCodeService() {
    return (
      <span>This Access Code is wrong.</span>
    );
  }

  render() {
    var { type, status, verification } = this.props;
    var output = false;
    var validatorStyle = {
      backgroundColor: this.context.primaryColor
    };

    if (status === false) {
      switch (type) {
        case 'EmondoEmailFieldService':
          output = this.renderEmondoEmailFieldService();
          break;
        case 'AccessCodeService':
          output = this.renderAccessCodeService();
          break;
        default:
          return false;
      }

      return (
        <div className={styles.errorField} style={validatorStyle}>
          {output}
        </div>
      );
    } else {
      return false;
    }
  }
}

export default Verifier;
