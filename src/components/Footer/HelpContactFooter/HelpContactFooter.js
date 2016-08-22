import React, {
  Component,
  PropTypes
} from 'react';
import { FaCircle } from 'react-icons/lib/fa';
import styles from './HelpContactFooter.scss';

export default class HelpContactFooter extends Component {
  static propTypes = {
    className: PropTypes.string
  }
  render() {
    return (
      <ul className={styles.footerLinkList + ' ' + this.props.className}>
        <li className={styles.footerLink}>
          Questions?
        </li>
        <li className={styles.footerLink}>
          <FaCircle />
          {' '}
          <a href="#">
            1800 Emondo
          </a>
        </li>
        <li className={styles.footerLink}>
          <FaCircle />
          {' '}
          <a href="#">
            Live Chat
          </a>
        </li>
        <li className={styles.footerLink}>
          <FaCircle />
          {' '}
          <a href="#">
            FAQ
          </a>
        </li>
      </ul>
    );
  }
}
