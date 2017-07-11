import React, {
  Component,
  PropTypes
} from 'react';
import StackLogo from 'components/Logos/StackLogo';
import styles from './IdentityVerificationHeader.scss';

export default class IdentityVerificationHeader extends Component {

  static contextTypes = {
    primaryColour: React.PropTypes.string
  };

  static propTypes = {
    /*
     * title: Form title
     */
    title: PropTypes.string.isRequired,

    /*
     * logo: Form title
     */
    logo: PropTypes.string
  }

  render() {
    const { title, logo } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <div className={styles.logoWrapper}>
            <StackLogo logoStyle="grey" width="auto" height={45} url={logo} />
          </div>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    );
  }
}
