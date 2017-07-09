import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  Col,
  FormGroup,
  OverlayTrigger,
  Popover,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router';
import IDVerificationFormWrapper from 'components/IDVerification/IDVerificationFormWrapper';
import styles from './IDVerificationFormFooter.scss';

const termsConditions = (
  <Popover id="idVerificationTermsConditions">
    <div className={styles.termsConditions}>
      I give my consent for my details to be checked online with DVS Driver License Search.{' '}
      I confirm that I am utilising Trulioo for an identity check to facilitate the carrying{' '}
      out of an applicable customer identification procedure under the Anti-Money Laundering{' '}
      and Counter-Terrorism Financing Act 2006.
    </div>
  </Popover>
);

export default class IDVerificationFormFooter extends Component {
  render() {
    return (
      <div className={styles.footerWrapper}>
        <IDVerificationFormWrapper>
          <FormGroup>
            <Checkbox inline>
              I have read and agree to the{' '}
              <OverlayTrigger trigger="focus" placement="top" overlay={termsConditions}>
                <a href="javascript:;" className={styles.termsLink}>
                  terms and conditions.
                </a>
              </OverlayTrigger>
            </Checkbox>
          </FormGroup>
        </IDVerificationFormWrapper>
        <div className={styles.footer}>
          <IDVerificationFormWrapper>
            <Row>
              <Col xs={6}>
                <Link to="javascript:;" className={styles.cancelLink}>Verify Later</Link>
              </Col>
              <Col xs={6} className="text-right">
                <Button bsStyle="primary" className={styles.submitButton} type="submit">
                  Verify my ID
                </Button>
              </Col>
            </Row>
          </IDVerificationFormWrapper>
        </div>
      </div>
    );
  }
}
