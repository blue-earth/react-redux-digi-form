import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Button,
  Checkbox,
  Col,
  Form,
  FormGroup,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router';
import { Field } from 'redux-form';
import {
  genderList,
  identityConstants,
  identityDocumentTypesList
} from 'schemas/idVerificationFormSchema';
import { ControlLabel, FormControl, renderInput, renderSelect } from '../helpers';
import styles from './PassportForm.scss';

export default class PassportForm extends Component {
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
    setNotice: PropTypes.func.isRequired
  };

  static defaultProps = {
    requestSubmitIdentity: () => {},
    doneSubmitIdentity: () => {}
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

  handleSubmitForm = (values) => {
    const { submitIdentity, setNotice } = this.props;
    let body = {};
    body = this.getPassportFields(values);

    submitIdentity({
      body,
      success: (data) => {
        if (data['result']) {
          // The success here means the request succeed, does not refer to the verification succeed
          alert('Identity Verification Success!');
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
    return (
      <Form onSubmit={handleSubmit(this.handleVerify)}>
        <IDVerificationFormWrapper>
          <FormGroup>
            <ControlLabel>Identity document type</ControlLabel>
            <FormControl componentClass="select" onChange={setIdType} value={idType}>
              {typeOptions}
            </FormControl>
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
                name="verification_data.passport.place_of_birth"
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
            <Col xs={6}>
              <Field component={renderInput}
                name="person.email"
                type="email"
                label="Email"
                placeholder="Email" />
            </Col>
          </Row>
        </IDVerificationFormWrapper>
        <IDVerificationFormFooter />
      </Form>
    );
  }
}
