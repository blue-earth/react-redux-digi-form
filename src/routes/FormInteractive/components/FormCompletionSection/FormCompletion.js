import React, {
  Component
} from 'react';
import styles from './FormCompletion.scss';
import FormHeader from 'components/Headers/FormHeader';
import {
  Grid,
  Col,
  Button
} from 'react-bootstrap';
import EnvironmentSaving from 'components/EnvironmentSaving';
import SocialShareFooter from 'components/Footer/SocialShareFooter';
import StackLogo from 'components/Logos/StackLogo';

class FormCompletion extends Component {

  render() {
    return (
      <div className={styles.wrapper}>
        <FormHeader title="Form2" submitAnswer={this.submitAnswer} />
        <Grid className={styles.contentWrapper}>
          <Col md={8} mdPush={2}>
            <h4 className={styles.thankMessage}>THANK YOU FOR COMPLETING</h4>
            <h2 className={styles.formTitle}>CMS Markets Account Application</h2>
            <hr />
            <div className={styles.instruction}>
              A copy of your completed application form will be sent to {'jordan@emondo.co'}
            </div>
            <Button bsStyle="primary" className={styles.downloadButton}>Download your submission</Button>
            <hr />
            <div className={styles.instruction}>By using our electronic forms you saved:</div>
            <div className={styles.envSavingSection}>
              <EnvironmentSaving type="trees" value={0.34} />
              <EnvironmentSaving type="co2" value={0.56} />
              <EnvironmentSaving type="water" value={1.56} />
            </div>
            <div className={styles.instruction}>
              <Button bsStyle="link" className={styles.learnMoreButton}>Learn more</Button>
              <div className={styles.divider}>{' '}</div>
              <div className={styles.socialSharingWrapper}>Share: </div>
              <SocialShareFooter />
            </div>
          </Col>
          <div className={styles.bottomLogoWrapper}>
            <span>Powered by</span>
            <div className={styles.bottomLogo}>
              <StackLogo logoStyle="darkgrey" width={80} />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

export default FormCompletion;
