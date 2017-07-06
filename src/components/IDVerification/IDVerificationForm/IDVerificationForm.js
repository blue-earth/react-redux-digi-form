import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Button,
  Checkbox,
  Col,
  ControlLabel as BSControlLabel,
  Form,
  FormControl as BSFormControl,
  FormGroup,
  Nav,
  NavItem,
  OverlayTrigger,
  Popover,
  Row,
  Tab
} from 'react-bootstrap';
import { Link } from 'react-router';
import {
  genderList,
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import { IDENTITY_ATTACHMENT_URL } from 'redux/modules/identityVerification';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
import XHRUploader from 'components/XHRUploader';
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
    errors: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitIdentity: PropTypes.func.isRequired,
    requestSubmitIdentity: PropTypes.func,
    doneSubmitIdentity: PropTypes.func,
    addAttachment: PropTypes.func,
    removeAttachment: PropTypes.func
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

  getPassportFields(fields) {
    const body = {
      'type': parseInt(fields.type, 10),
      'verification_data': {
        'passport': {
          'number': fields.passport_number,
          'expiry_date': fields.expiry_date,
          'place_of_birth': fields.place_of_birth,
          'country': 'AU'
        }
      },
      'person': {
        'first_name': fields.first_name,
        'last_name': fields.last_name,
        'date_of_birth': fields.date_of_birth,
        'gender': parseInt(fields.gender, 10)
      }
    };
    return body;
  }

  handleVerify = (fields) => {
    const { submitIdentity } = this.props;
    let body = {};
    switch (parseInt(fields.type, 10)) {
      case identityConstants.DVSPASSPORT:
        body = this.getPassportFields(fields);
        break;
      case identityConstants.DVSDRIVERLICENSE:
        body = this.getPassportFields(fields);
        break;
      case identityConstants.DVSMEDICARECARD:
        body = this.getPassportFields(fields);
        break;
      case identityConstants.AUSTRALIAN_ELECTORAL_ROLL:
        body = this.getPassportFields(fields);
        break;
      case identityConstants.AUSTRALIAN_CREDIT_AGENCY:
        body = this.getPassportFields(fields);
        break;
      case identityConstants.MANUAL_FILE_UPLOAD:
        body = this.getPassportFields(fields);
        break;
      default:
        return;
    }

    submitIdentity({
      body,
      success: (data) => {
        if (data['value']) {
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
    const { fields } = this.props;

    const typeOptions = _.map(identityDocumentTypesList, (item, index) => (
      <option value={item.value} key={index}>{item.label}</option>
    ));

    const genderOptions = _.map(genderList, (item, index) => (
      <option value={item.value} key={index}>{item.label}</option>
    ));

    return (
      <div>
        <FormGroup>
          <ControlLabel>Identity document type</ControlLabel>
          <FormControl componentClass="select" {...fields.type}>
            {typeOptions}
          </FormControl>
          <FormFieldError for={fields.type} />
        </FormGroup>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Passport no.(incl. letters)</ControlLabel>
              <FormControl type="text" placeholder="Passport no." {...fields.passport_number} />
              <FormFieldError for={fields.passport_number} />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Date of birth</ControlLabel>
              <FormControl type="date" placeholder="Date of birth" {...fields.date_of_birth} />
              <FormFieldError for={fields.date_of_birth} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>First name</ControlLabel>
              <FormControl type="text" placeholder="First name" {...fields.first_name} />
              <FormFieldError for={fields.first_name} />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Last name</ControlLabel>
              <FormControl type="text" placeholder="Last name" {...fields.last_name} />
              <FormFieldError for={fields.last_name} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Gender</ControlLabel>
              <FormControl componentClass="select" {...fields.gender}>
                {genderOptions}
              </FormControl>
              <FormFieldError for={fields.gender} />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Place of birth</ControlLabel>
              <FormControl type="text" placeholder="Place of birth" {...fields.place_of_birth} />
              <FormFieldError for={fields.place_of_birth} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Expiry date</ControlLabel>
              <FormControl type="date" placeholder="Expiry date" {...fields.expiry_date} />
              <FormFieldError for={fields.expiry_date} />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  renderUploader() {
    return (
      <div>
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
        <XHRUploader
          url={IDENTITY_ATTACHMENT_URL}
          fieldName="file"
          method="POST"
          maxFiles={1}
          accept="image/*"
          onStart={this.handleUploadFail}
          onCancel={this.handleCancelFile}
          onSuccess={this.handleUploadSuccess}
        />
      </div>
    );
  }

  render() {
    const { align, handleSubmit } = this.props;
    const { notice } = this.state;

    return (
      <Form onSubmit={handleSubmit(this.handleVerify)} className={styles.idVerificationForm}>
        <IDVerificationTitle align={align} notice={notice} />
        <Tab.Container id="IDVerificationFormTabs" defaultActiveKey="online">
          <div className={styles.tabs}>
            <div className={styles.navsWrapper}>
              <Nav bsStyle="tabs" bsClass="idVerification" className={styles.wrapper}>
                <NavItem eventKey="online">
                  Verify online
                </NavItem>
                <NavItem eventKey="upload">
                  Upload ID
                </NavItem>
              </Nav>
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
        <div className={styles.wrapper}>
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
        </div>
        <div className={styles.footer}>
          <div className={styles.wrapper}>
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
          </div>
        </div>
      </Form>
    );
  }
}
