import React, {
  Component,
  PropTypes
} from 'react';
import _ from 'lodash';
import styles from './Verifier.scss';
class Verifier extends Component {
  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired
  };

  static defaultMessages = {
    'EmondoEmailFieldService': 'Please enter a valid email.',
    'AccessCodeService': 'Incorrect password. Passwords are case sensitive.',
    'EmondoAuthenticationService': 'This Access Code is wrong.'
  }

  render() {
    var { type, status } = this.props;
    var output = false;
    output = _.defaultTo(Verifier.defaultMessages[type], false);
    console.log(type, status);

    if (status === false) {
      return (
        <div className={styles.errorField}>
          {output}
        </div>
      );
    } else {
      return false;
    }
  }
}

export default Verifier;
