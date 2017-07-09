import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Col,
  Form,
  FormGroup,
  Nav,
  NavItem,
  Row,
  Tab
} from 'react-bootstrap';
import { Field } from 'redux-form';
import {
  genderList,
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import IDVerificationTitle from '../IDVerificationTitle';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';
import PassportForm from '../PassportForm';
import UploaderField from '../UploaderField';
import FormFieldError from 'components/FormFieldError';
import styles from './IDVerificationForm.scss';

const ControlLabel = (props) => <BSControlLabel className={styles.label} {...props} />;
const FormControl = (props) => <BSFormControl className={styles.control} {...props} />;
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

export default class IDVerificationForm extends Component {
  static propTypes = {
    activeTab: PropTypes.oneOf([
      'online', 'upload'
    ]),
    align: PropTypes.oneOf([
      'left', 'center', 'right'
    ]),
    handleSubmit: PropTypes.func.isRequired,
    submitIdentity: PropTypes.func.isRequired,
    requestSubmitIdentity: PropTypes.func,
    doneSubmitIdentity: PropTypes.func,
    addAttachment: PropTypes.func.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    attachments: PropTypes.array.isRequired,
    idType: PropTypes.number.isRequired,
    setIdType: PropTypes.func.isRequired
  };

  static defaultProps = {
    requestSubmitIdentity: () => {},
    doneSubmitIdentity: () => {},
    addAttachment: () => {},
    removeAttachment: () => {},
    align: 'left'
  }

  constructor(props) {
    super(props);
    this.state = {
      notice: 'We require additional information to verify your identification online'
    };
  }

  getPassportFields(values) {
    const body = _.merge({
      'type': identityConstants.DVSPASSPORT,
      'verification_data': {
        'passport': {
          'country': 'AU'
        }
      }
    }, values);
    return body;
  }

  getUploadFields(fields) {
    const { attachments } = this.props;
    const body = {
      'type': parseInt(fields.type, 10),
      'person': {
        'id': 1
      },
      'attachment_ids': attachments
    };
    return body;
  }

  handleVerify = (values) => {
    const { submitIdentity } = this.props;
    let body = {};
    body = this.getPassportFields(values);
    // switch (parseInt(fields.type, 10)) {
    //   case identityConstants.DVSPASSPORT:
    //     body = this.getPassportFields(fields);
    //     break;
    //   case identityConstants.DVSDRIVERLICENSE:
    //     body = this.getPassportFields(fields);
    //     break;
    //   case identityConstants.DVSMEDICARECARD:
    //     body = this.getPassportFields(fields);
    //     break;
    //   case identityConstants.AUSTRALIAN_ELECTORAL_ROLL:
    //     body = this.getPassportFields(fields);
    //     break;
    //   case identityConstants.AUSTRALIAN_CREDIT_AGENCY:
    //     body = this.getPassportFields(fields);
    //     break;
    //   case identityConstants.MANUAL_FILE_UPLOAD:
    //     body = this.getUploadFields(fields);
    //     break;
    //   default:
    //     return;
    // }

    submitIdentity({
      body,
      success: (data) => {
        if (data['result']) {
          // The success here means the request succeed, does not refer to the verification succeed
          alert('Identity Verification Success!');
        } else {
          this.setState({
            notice: 'Failed to verify your identity. Please verify against other type of document.'
          });
        }
      },
      fail: () => {
        this.setState({
          notice: 'Failed to verify your identity. Please verify against other type of document.'
        });
      }
    });
  }

  handleUploadSuccess = (response) => {
    const { doneSubmitIdentity, addAttachment } = this.props;
    doneSubmitIdentity();
    addAttachment(response.id);
    alert('Identity Verification Success!');
  }

  handleUploadFail = (response) => {
    const { doneSubmitIdentity } = this.props;
    doneSubmitIdentity();
    this.setState({
      notice: 'Failed to verify your identity. Please verify against other type of document.'
    });
  }

  handleCancelFile = () => {
    const { doneSubmitIdentity, removeAttachment } = this.props;
    doneSubmitIdentity();
    removeAttachment();
  }

  renderVerifyOnline() {
    return (
      <div>
        <PassportForm {...this.props} />
      </div>
    );
  }

  renderUploader() {
    return (
      <div>
        <IDVerificationFormWrapper>
          <div className={styles.uploadDescription}>
            <p>
              Please make sure all identification is a <em>certified copy</em>.<br />
              You can also send identification to accounts@cmc.com{' '}
              or mail to: PO Box 165, Sydney NSW, Australia 2000
            </p>
            <p>
              Documents to upload:<br />
              <em>Driver’s licence</em> OR <em>Australian Passport</em>
            </p>
          </div>
          <Field name="attachments" component={UploaderField} />
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter />
      </div>
    );
  }

  render() {
    const { align, handleSubmit } = this.props;
    const { notice } = this.state;

    return (
      <div className={styles.idVerificationForm}>
        <IDVerificationTitle align={align} notice={notice} />
        <Tab.Container id="IDVerificationFormTabs" defaultActiveKey="online">
          <div className={styles.tabs}>
            <div className={styles.navsWrapper}>
              <IDVerificationFormWrapper>
                <Nav bsStyle="tabs" bsClass="idVerification">
                  <NavItem eventKey="online">
                    Verify online
                  </NavItem>
                  <NavItem eventKey="upload">
                    Upload ID
                  </NavItem>
                </Nav>
              </IDVerificationFormWrapper>
            </div>
            <Tab.Content animation className={styles.tabContent}>
              <Tab.Pane eventKey="online">
                {this.renderVerifyOnline()}
              </Tab.Pane>
              <Tab.Pane eventKey="upload">
                {this.renderUploader()}
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    );
  }
}
