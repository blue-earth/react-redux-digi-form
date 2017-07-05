import React, {
  Component
} from 'react';
import styles from './SocialShareFooter.scss';
import {
  FaGooglePlus,
  FaFacebook,
  FaTwitter
} from 'react-icons/lib/fa';

class SocialShareFooter extends Component {
  render() {
    return (
      <section className={styles.socialShareWrapper}>
        <div className={styles.socialShareButton}>
          <FaTwitter size={16} style={{verticalAlign: 'baseline'}} />
        </div>
        <div className={styles.socialShareButton}>
          <FaFacebook size={16} style={{verticalAlign: 'baseline'}} />
        </div>
        <div className={styles.socialShareButton}>
          <FaGooglePlus size={16} style={{verticalAlign: 'baseline'}} />
        </div>
      </section>
    );
  }
}

export default SocialShareFooter;
