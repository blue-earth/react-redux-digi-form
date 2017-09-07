import React, {
  Component
} from 'react';
import PlainHeader from 'components/Headers/PlainHeader';
import styles from './NotFoundPage.scss';

class NotFoundPage extends Component {
  render() {
    const content = require('./404.png');
    return (
      <div className={styles.notFoundPage}>
        <PlainHeader extraClass={styles.header} />
        <section className={styles.imageSection}>
          <img src={content} className={styles.image} />
        </section>
        <section className={styles.infoSection}>
          <p>The page you were looking for doesn't exist.</p>
        </section>
      </div>
    );
  }
}

export default NotFoundPage;
