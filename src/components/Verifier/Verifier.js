import React, {
  Component,
  PropTypes
} from 'react';
import styles from './Verifier.scss';
class Verifier extends Component {
  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired
  };
  renderEmondoEmailFieldService() {
    return (
      <span>This email is unavailable.</span>
    );
  }

  renderEmondoAuthenticationService() {
    return (
      <span>Incorrect password. Passwords are case sensitive.</span>
    );
  }

  renderAccessCodeService() {
    return (
      <span>This Access Code is wrong.</span>
    );
  }

  render() {
    var { type, status } = this.props;
    var output = false;
    var validatorStyle = {
      backgroundColor: this.context.primaryColour
    };

    if (status === false) {
      switch (type) {
        case 'EmondoEmailFieldService':
          output = this.renderEmondoEmailFieldService();
          break;
        case 'AccessCodeService':
          output = this.renderAccessCodeService();
          break;
        case 'EmondoAuthenticationService':
          output = this.renderEmondoAuthenticationService();
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
