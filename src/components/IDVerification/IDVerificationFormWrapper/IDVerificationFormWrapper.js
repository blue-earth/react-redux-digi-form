import React, {
  Component,
  PropTypes
} from 'react';
import styles from './IDVerificationFormWrapper.scss';

export default class IDVerificationFormWrapper extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node.isRequired,
      PropTypes.array.isRequired
    ])
  };

  render() {
    return (
      <div className={styles.wrapper}>
        {this.props.children}
      </div>
    );
  }
}
