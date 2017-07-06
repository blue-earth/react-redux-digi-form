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
import { Field } from 'redux-form';
import {
  genderList,
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import IDVerificationTitle from 'components/IDVerification/IDVerificationTitle';
import UploaderField from 'components/IDVerification/UploaderField';
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

const renderInput = field => (
  <FormGroup>
    <ControlLabel>{field.label}</ControlLabel>
    <FormControl type={field.type} placeholder={field.placeholder} {...field.input} />
    <FormFieldError for={field} />
  </FormGroup>
);

const renderSelect = field => (
  <FormGroup>
    <ControlLabel>{field.label}</ControlLabel>
    <FormControl componentClass="select" {...field.input}>
      {field.children}
    </FormControl>
    <FormFieldError for={field} />
  </FormGroup>
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
    addAttachment: PropTypes.func.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    attachments: PropTypes.array.isRequired
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
        body = this.getUploadFields(fields);
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
            <Field component={renderInput}
              name="verification_data.passport.number"
              type="text"
              label="Passport no.(incl. letters)"
              placeholder="Passport no." />
          </Col>
          <Col xs={6}>
            <Field component={renderInput}
              name="person.date_of_birth"
              type="date"
              label="Date of birth"
              placeholder="Date of birth" />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field component={renderInput}
              name="person.first_name"
              type="text"
              label="First name"
              placeholder="First name" />
          </Col>
          <Col xs={6}>
            <Field component={renderInput}
              name="person.last_name"
              type="text"
              label="Last name"
              placeholder="Last name" />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field component={renderSelect}
              name="person.gender"
              label="Gender"
              placeholder="Gender">
              {genderOptions}
            </Field>
          </Col>
          <Col xs={6}>
            <Field component={renderInput}
              name="person.place_of_birth"
              type="text"
              label="Place of birth"
              placeholder="Place of birth" />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field component={renderInput}
              name="verification_data.passport.expiry_date"
              type="date"
              label="Expiry date"
              placeholder="Expiry date" />
          </Col>
        </Row>
      </div>
    );
  }

  renderUploader() {
    console.log(Field);
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
        <Field name="attachments" component={UploaderField} />
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
