import React, {
  Component,
  PropTypes
} from 'react';
import {
  Col,
  Button
} from 'react-bootstrap';
import styles from './FormCompletion.scss';
import EnvironmentSaving from 'components/EnvironmentSaving';
import SocialShareFooter from 'components/Footer/SocialShareFooter';

class FormCompletion extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    numberOfPages: PropTypes.number.isRequired
  };

  render() {
    const { title, numberOfPages } = this.props;
    return (
      <div className={styles.formCompletion}>
        <Col lg={8} lgPush={2}>
          <h4 className={styles.thankMessage}>THANK YOU FOR COMPLETING</h4>
          <h2 className={styles.formTitle}>{title}</h2>
          <hr />
          <div className={styles.instruction}>
            A copy of your completed application form will be sent to {'jordan@emondo.co'}
          </div>
          <Button bsStyle="primary" className={styles.downloadButton}>Download your submission</Button>
          <hr />
          <div className={styles.instruction}>By using our electronic forms you saved:</div>
          <div className={styles.envSavingSection}>
            <EnvironmentSaving type="trees" numberOfPages={numberOfPages} />
            <EnvironmentSaving type="co2" numberOfPages={numberOfPages} />
            <EnvironmentSaving type="water" numberOfPages={numberOfPages} />
          </div>
          <div className={styles.instruction}>
            <Button bsStyle="link" className={styles.learnMoreButton}>Learn more</Button>
            <div className={styles.divider}>{' '}</div>
            <div className={styles.socialSharingWrapper}>Share: </div>
            <SocialShareFooter />
          </div>
        </Col>
      </div>
    );
  }
}

export default FormCompletion;
