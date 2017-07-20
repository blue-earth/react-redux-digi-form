import React, { Component, PropTypes } from 'react';
import {
  Button,
  Col,
  OverlayTrigger,
  Popover,
  Row
} from 'react-bootstrap';
import { Field } from 'redux-form';
import { renderCheckbox } from '../helpers';
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
  static propTypes = {
    submitting: PropTypes.bool,
    onLinkClick: PropTypes.func,
    submitLabel: PropTypes.string,
    includeTerms: PropTypes.bool
  };

  static defaultProps = {
    submitting: false,
    onLinkClick: () => {},
    submitLabel: 'Verify my ID',
    includeTerms: true
  };

  render() {
    const { includeTerms, onLinkClick, submitting, submitLabel } = this.props;
    const checkboxLabel = (
      <span>
        I have read and agree to the{' '}
        <OverlayTrigger trigger="focus" placement="top" overlay={termsConditions}>
          <a href="javascript:;" className={styles.termsLink}>
            terms and conditions.
          </a>
        </OverlayTrigger>
      </span>
    );
    return (
      <div className={styles.footerWrapper}>
        {includeTerms &&
          <div className={styles.termsSection}>
            <IDVerificationFormWrapper>
              <Field component={renderCheckbox} type="checkbox"
                label={checkboxLabel}
                name="terms_conditions" />
            </IDVerificationFormWrapper>
          </div>
        }
        <div className={styles.footer}>
          <IDVerificationFormWrapper>
            <Row>
              <Col xs={6}>
                <a href="javascript:;" className={styles.cancelLink}
                  onClick={onLinkClick}>
                  Verify Later
                </a>
              </Col>
              <Col xs={6} className="text-right">
                <Button bsStyle="primary" className={styles.submitButton} type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : submitLabel}
                </Button>
              </Col>
            </Row>
          </IDVerificationFormWrapper>
        </div>
      </div>
    );
  }
}
