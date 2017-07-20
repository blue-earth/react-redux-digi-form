import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Col,
  Form,
  FormGroup,
  Row
} from 'react-bootstrap';
import { Field } from 'redux-form';
import {
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import { ControlLabel, FormControl, renderInput } from '../helpers';
import IDVerificationFormFooter from '../IDVerificationFormFooter';
import IDVerificationFormWrapper from '../IDVerificationFormWrapper';

export default class DriversLicenseForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    idType: PropTypes.number.isRequired,
    setIdType: PropTypes.func.isRequired,
    submitIdentity: PropTypes.func.isRequired,
    setNotice: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onLinkClick: PropTypes.func
  };

  getPassportFields(values) {
    const body = _.merge({
      'type': identityConstants.DVSDRIVERLICENSE
    }, values);
    return body;
  }

  handleIdTypeChange = (event) => {
    const { setIdType } = this.props;
    setIdType(parseInt(event.target.value, 10));
  }

  handleSubmitForm = (values) => {
    const { submitIdentity, setNotice } = this.props;
    let body = {};
    body = this.getPassportFields(values);

    submitIdentity({
      body,
      success: (data) => {
        if (data['result']) {
          // The success here means the request succeed, does not refer to the verification succeed
          setNotice('Identity Verification Success!');
        } else {
          setNotice('Failed to verify your identity. Please verify against other type of document.');
        }
      },
      fail: () => {
        setNotice('Failed to verify your identity. Please verify against other type of document.');
      }
    });
  }

  render() {
    const { handleSubmit, idType, isSubmitting, onLinkClick } = this.props;
    const typeOptions = _.map(identityDocumentTypesList, (item, index) => (
      <option value={item.value} key={index}>{item.label}</option>
    ));
    return (
      <Form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <IDVerificationFormWrapper>
          <FormGroup>
            <ControlLabel>Identity document type</ControlLabel>
            <FormControl componentClass="select" onChange={this.handleIdTypeChange} value={idType}>
              {typeOptions}
            </FormControl>
          </FormGroup>
          <Row>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.driver_license.number"
                type="text"
                label="Driver's license no."
                placeholder="Passport no." />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.driver_license.state"
                type="text"
                label="State/Territory"
                placeholder="ex. NSW" />
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
              <Field component={renderInput}
                name="person.date_of_birth"
                type="date"
                label="Date of birth"
                placeholder="Date of birth" />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.driver_license.rta_card_number"
                type="text"
                label="RTA Card Number"
                placeholder="(NSW only)" />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field component={renderInput}
                name="verification_data.driver_license.expiry_date"
                type="date"
                label="Expiry date"
                placeholder="Expiry date" />
            </Col>
            <Col xs={6}>
              <Field component={renderInput}
                name="person.email"
                type="email"
                label="Email"
                placeholder="Email" />
            </Col>
          </Row>
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter submitting={isSubmitting} onLinkClick={onLinkClick} />
      </Form>
    );
  }
}
