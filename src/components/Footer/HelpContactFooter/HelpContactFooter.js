import React, {
  Component,
  PropTypes
} from 'react';
import { IoIosTelephone, IoIosChatbubble, IoHelpCircled } from 'react-icons/lib/io';
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
          <IoIosTelephone size={16} style={{verticalAlign: 'bottom'}} />
          {' '}
          <a href="#">
            1800 Emondo
          </a>
        </li>
        <li className={styles.footerLink}>
          <IoIosChatbubble size={16} style={{verticalAlign: 'bottom'}} />
          {' '}
          <a href="#">
            Live Chat
          </a>
        </li>
        <li className={styles.footerLink}>
          <IoHelpCircled size={16} style={{verticalAlign: 'bottom'}} />
          {' '}
          <a href="#">
            FAQ
          </a>
        </li>
      </ul>
    );
  }
}
